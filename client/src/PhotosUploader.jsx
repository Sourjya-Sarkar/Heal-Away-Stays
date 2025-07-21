import { useState } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function PhotosUploader({ addedPhotos, onChange }) {
  const [photoLink, setPhotoLink] = useState("");

  async function addPhotoByLink(e) {
    e.preventDefault();
    try {
      const response = await axios.post("/upload-by-link", { link: photoLink });
      const filename = response.data.filename;
      onChange((prev) => [...prev, filename]);
      setPhotoLink("");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed: " + (error.response?.data?.error || error.message));
    }
  }

  async function uploadPhoto(e) {
    const files = e.target.files;
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }
    try {
      const res = await axios.post("/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const { filenames } = res.data;
      onChange((prev) => [...prev, ...filenames]);
    } catch (err) {
      console.error("Device upload failed:", err);
      alert("Device upload failed.");
    }
  }

  function onDragEnd(result) {
    if (!result.destination) return;
    const items = Array.from(addedPhotos);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    onChange(items);
  }

  function removePhoto(filename) {
    onChange((prev) => prev.filter((photo) => photo !== filename));
  }

  function selectAsMainPhoto(filename) {
    const newPhotos = [
      filename,
      ...addedPhotos.filter((photo) => photo !== filename),
    ];
    onChange(newPhotos);
  }

  return (
    <>
      <div className="flex gap-4">
        <input
          type="text"
          value={photoLink}
          onChange={(e) => setPhotoLink(e.target.value)}
          placeholder="Paste image URL"
          className="w-full border rounded px-3 py-2"
        />
        <button
          onClick={addPhotoByLink}
          type="button"
          className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 rounded-lg"
        >
          Add Photo
        </button>
      </div>

      <div className="flex gap-4 mt-4">
        <label className="border border-gray-400 font-medium hover:border-blue-600 text-white bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded-lg cursor-pointer">
          Upload from Device
          <input
            type="file"
            multiple
            onChange={uploadPhoto}
            className="hidden"
          />
        </label>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="photos" direction="horizontal">
          {(provided) => (
            <div
              className="mt-6 grid grid-cols-3 md:grid-cols-4 gap-4"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {addedPhotos.map((link, index) => (
                <Draggable key={link} draggableId={link} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="relative group"
                    >
                      <img
                        src={`http://localhost:3000/uploads/${link}`}
                        alt=""
                        className="w-full h-32 object-cover rounded"
                      />

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removePhoto(link)}
                        className="absolute top-1 right-1 bg-black bg-opacity-70 text-white rounded-full px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition"
                      >
                        ✕
                      </button>

                      {/* Star Button for Main Photo */}
                      <button
                        type="button"
                        onClick={() => selectAsMainPhoto(link)}
                        className={`absolute top-1 left-1 text-xl rounded-full ${
                          index === 0
                            ? "text-yellow-400"
                            : "text-white opacity-70"
                        } hover:scale-110 transition`}
                        title="Set as main photo"
                      >
                        {index === 0 ? "★" : "☆"}
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
}
