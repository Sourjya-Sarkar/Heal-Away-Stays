// models/Booking.js
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    place: { type: mongoose.Schema.Types.ObjectId, ref: "Place" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    checkIn: Date,
    checkOut: Date,
    totalPrice: Number,
    //razorpayOrderId: String,
    //razorpayPaymentId: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
