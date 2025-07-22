const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer"); // ✅ added
const User = require("./models/User");
const Place = require("./models/Place");
require("dotenv").config();
const Booking = require("./models/Booking");

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = process.env.JWT_SECRET;

app.use(express.json());
app.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    origin: [
      "http://localhost:5173", // local dev
      "https://heal-away-stays-six.vercel.app", // production URL
    ],
    // adjust if frontend is hosted elsewhere
  })
);
app.use(cookieParser());
app.use(
  "/uploads",
  express.static(uploadsPath, {
    setHeaders: (res) => {
      res.set("Cross-Origin-Resource-Policy", "cross-origin"); // ✅ Prevents CORP error
      res.set("Access-Control-Allow-Origin", "*"); // ✅ Optional if needed for img tags
    },
  })
);

console.log("Connecting to MongoDB...");
mongoose.connect(process.env.MONGO_URL);

// ✅ Ensure "uploads" directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ✅ Multer config for handling file uploads
const photoMiddleware = multer({ dest: uploadDir });

function getUserFromToken(req) {
  return new Promise((resolve, reject) => {
    const token = req.cookies?.token;
    if (!token) return resolve(null);

    jwt.verify(token, jwtSecret, {}, (err, userData) => {
      if (err) return reject(err);
      resolve(userData);
    });
  });
}

app.get("/test", (req, res) => {
  res.json("ok");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    res.json({ _id: userDoc._id, name: userDoc.name, email: userDoc.email });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(422).json({ error: error.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });
  if (!userDoc) {
    return res.status(422).json("User not found");
  }
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    jwt.sign(
      { email: userDoc.email, id: userDoc._id },
      jwtSecret,
      {},
      (err, token) => {
        if (err) throw err;
        res
          .cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
          })
          .json({ _id: userDoc._id, name: userDoc.name, email: userDoc.email });
      }
    );
  } else {
    res.status(422).json("Wrong credentials");
  }
});

app.get("/profile", (req, res) => {
  res.set("Cache-Control", "no-store");
  const token = req.cookies.token;
  if (!token) return res.json(null);
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) return res.json(null);
    const userDoc = await User.findById(userData.id);
    if (!userDoc) return res.json(null);
    res.json({ _id: userDoc._id, name: userDoc.name, email: userDoc.email });
  });
});

app.post("/logout", (req, res) => {
  res
    .cookie("token", "", {
      sameSite: "lax",
      secure: true,
      httpOnly: true,
      expires: new Date(0),
    })
    .json(true);
});

// ✅ Upload by link
app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body;

  if (!link || typeof link !== "string") {
    return res.status(400).json({ error: "Invalid URL" });
  }

  const extension = path.extname(link.split("?")[0]) || ".jpg"; // fallback if no extension
  const newName = "photo_" + Date.now() + extension;
  const destPath = path.join(uploadDir, newName);

  try {
    const response = await axios({
      method: "GET",
      url: link,
      responseType: "stream",
      maxRedirects: 5,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/115.0.0.0 Safari/537.36",
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        Referer: "https://www.google.com",
      },
    });

    const writer = fs.createWriteStream(destPath);
    response.data.pipe(writer);

    writer.on("finish", () => {
      console.log("✅ Image downloaded to:", destPath);
      res.json({ filename: newName });
    });

    writer.on("error", (err) => {
      console.error("❌ Write failed:", err.message);
      res.status(500).json({ error: "Failed to save image" });
    });
  } catch (err) {
    console.error("❌ Image download failed:", err.message);
    res.status(500).json({ error: "Download failed", message: err.message });
  }
});

// ✅ Upload from device
app.post("/upload", photoMiddleware.array("photos", 100), (req, res) => {
  const uploadedFiles = [];

  for (let file of req.files) {
    const ext = path.extname(file.originalname);
    const newPath = file.path + ext;
    fs.renameSync(file.path, newPath);
    uploadedFiles.push(path.basename(newPath));
  }

  res.json({ filenames: uploadedFiles });
});

app.post("/api/places", (req, res) => {
  const token = req.cookies.token;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) return res.json(null);
    const placeDoc = await Place.create({
      owner: userData.id,
      title: req.body.title,
      address: req.body.address,
      photos: req.body.photos,
      description: req.body.description,
      perks: req.body.perks,
      extraInfo: req.body.extraInfo,
      checkIn: req.body.checkIn,
      checkOut: req.body.checkOut,
      maxGuests: req.body.maxGuests,
    });
    res.json(placeDoc);
  });
});

app.get("/user-places", (req, res) => {
  const token = req.cookies.token;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) return res.status(401).json({ error: "Unauthorized" });

    try {
      const places = await Place.find({ owner: userData.id });
      res.json(places);
    } catch (e) {
      console.error("Error fetching user places:", e);
      res.status(500).json({ error: "Something went wrong" });
    }
  });
});

// ✅ Get place by ID
app.get("/places/:id", async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ error: "Place not found" });
    res.json(place);
  } catch (e) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// ✅ Get all places (public route for homepage)
app.get("/places", async (req, res) => {
  try {
    const places = await Place.find({});
    res.json(places);
  } catch (error) {
    console.error("Error fetching places:", error);
    res.status(500).json({ error: "Failed to fetch places" });
  }
});

// ✅ Update a place
app.put("/places/:id", (req, res) => {
  const token = req.cookies.token;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) return res.status(403).json({ error: "Unauthorized" });

    const {
      title,
      address,
      photos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price, // Include if your schema has it
    } = req.body;

    try {
      const place = await Place.findById(req.params.id); // ✅ Use route param here
      if (!place) return res.status(404).json({ error: "Not found" });

      if (place.owner.toString() !== userData.id) {
        return res.status(403).json({ error: "Forbidden" });
      }

      place.set({
        title,
        address,
        photos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });

      await place.save();
      res.json(place);
    } catch (e) {
      console.error("Update error:", e.message);
      res.status(500).json({ error: "Update failed" });
    }
  });
});

// ✅ Delete a place
app.delete("/places/:id", (req, res) => {
  const token = req.cookies.token;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) return res.status(403).json({ error: "Unauthorized" });

    const { id } = req.params;
    const place = await Place.findById(id);
    if (!place) return res.status(404).json({ error: "Place not found" });
    if (place.owner.toString() !== userData.id)
      return res.status(403).json({ error: "Forbidden" });

    await place.deleteOne();
    res.json({ success: true });
  });
});

app.get("/api/search", async (req, res) => {
  const query = req.query.q;
  try {
    const results = await Place.find({
      $or: [
        { title: new RegExp(query, "i") },
        { address: new RegExp(query, "i") },
        { description: new RegExp(query, "i") },
      ],
    });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Search failed" });
  }
});

// POST /bookings
app.post("/bookings", async (req, res) => {
  try {
    const userData = await getUserFromToken(req);

    if (!userData || !userData.id) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const { place, checkIn, checkOut, guests, phone, price } = req.body;

    const booking = await Booking.create({
      place,
      user: userData.id,
      checkIn,
      checkOut,
      guests,
      phone,
      price,
    });

    res.status(201).json(booking);
  } catch (err) {
    console.error("Booking failed:", err);
    res.status(500).json({ error: "Booking failed" });
  }
});

app.get("/bookings", async (req, res) => {
  try {
    const userData = await getUserFromToken(req);

    if (!userData || !userData.id) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const bookings = await Booking.find({ user: userData.id }).populate(
      "place"
    );
    res.json(bookings);
  } catch (err) {
    console.error("Failed to fetch bookings:", err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

app.delete("/bookings/:id", async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  try {
    // Optionally log/save the reason
    console.log(`Booking ${id} canceled for reason: ${reason}`);

    await Booking.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to cancel booking" });
  }
});

// Example Express route
app.get("/search", async (req, res) => {
  const query = req.query.query;
  const results = await Place.find({
    $or: [
      { title: { $regex: query, $options: "i" } },
      { address: { $regex: query, $options: "i" } },
    ],
  });
  res.json(results);
});

app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  // TODO: Find user by email, generate token, send email
  // You can use nodemailer + JWT or any email provider
  return res.json({ message: "Reset link sent to your email." });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
