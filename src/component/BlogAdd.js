import React, { useState } from "react";
import { Timestamp, collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { storage, db, auth } from "../firebaseConfig";
import { toast } from "react-toastify";

const BlogAdd = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    type: "",
    createdAt: Timestamp.now().toDate(),
  });

  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleBlogType = (e) => {
    const target = e.target;
    const name = target.name;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setFormData({
      ...formData,
      [name]: value,
   })
 };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handlePublish = () => {
    if (!formData.title || !formData.description) {
      alert("Please fill all the fields");
      return;
    }

    const storageRef = ref(
      storage,
      `/images/${Date.now()}${formData.image.name}`
    );

    const uploadImage = uploadBytesResumable(storageRef, formData.image);

    uploadImage.on(
      "state_changed",
      (snapshot) => {
        const progressPercent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progressPercent);
      },
      (err) => {
        console.log(err);
      },
      () => {
        setFormData({
          title: "",
          description: "",
          image: "",
          type: "",
        });

        getDownloadURL(uploadImage.snapshot.ref).then((url) => {
          const blogRef = collection(db, "Blogs");
          addDoc(blogRef, {
            title: formData.title,
            description: formData.description,
            type: formData.type,
            image: url,
            createdAt: Timestamp.now().toDate(),

          })
            .then(() => {
              toast("Blog added successfully", { type: "success" });
              setProgress(0);
            })
            .catch((err) => {
              toast("Error adding article", { type: "error" });
            });
        });
      }
    );
  };

  return (
    <div className="border p-3 mt-3 bg-light" style={{ position: "fixed" }}>
      <>
        <h2>Create article</h2>
        <div className="form-group">
          <label htmlFor="">Title</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={(e) => handleChange(e)}
          />
        </div>

        {/* description */}
        <label htmlFor="">Description</label>
        <textarea
          name="description"
          className="form-control"
          value={formData.description}
          onChange={(e) => handleChange(e)}
        />

        {/* image */}
        <label htmlFor="">Image</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          className="form-control"
          onChange={(e) => handleImageChange(e)}
        />

        <div className="chechBox mt-4">
          <p>Blog Type Select</p>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              name="electronics"
              id="checkbox1"
              onChange={handleBlogType}
              checked={formData.electronics}
            />
            <label className="form-check-label" htmlFor="checkBox1">
              Electronics
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              name="fashion"
              id="checkBox2"
              onChange={handleBlogType}
              checked={formData.fashion}
            />
            <label className="form-check-label" htmlFor="checkBox2">
              Fashion
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              name="utiltities"
              id="checkBox3"
              onChange={handleBlogType}
              checked={formData.utiltities}
            />
            <label className="form-check-label" htmlFor="checkBox3">
              Utiltities
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              name="hygeine"
              id="checkBox4"
              onChange={handleBlogType}
              checked={formData.hygeine}
            />
            <label className="form-check-label" htmlFor="checkBox4">
              Hygeine
            </label>
          </div>
        </div>

        {progress === 0 ? null : (
          <div className="progress">
            <div
              className="progress-bar progress-bar-striped mt-2"
              style={{ width: `${progress}%` }}
            >
              {`uploading image ${progress}%`}
            </div>
          </div>
        )}
        <button
          className="form-control btn-primary mt-2"
          onClick={handlePublish}
        >
          Publish
        </button>
      </>
    </div>
  );
};

export default BlogAdd;
