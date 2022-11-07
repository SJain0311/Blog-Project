import React, { useEffect, useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  Timestamp,
  addDoc,
  collection,
  onSnapshot,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { storage, db, auth } from "../firebaseConfig";
import { toast } from "react-toastify";
import { ReactDOM } from "react-dom";
import { async } from "@firebase/util";
import { useParams } from "react-router-dom";

const checkboxes = [
  { id: 1, text: "Electronics" },
  { id: 2, text: "Fashion" },
  { id: 3, text: "Utiltities" },
  { id: 4, text: "Hygeine" },
];


const BlogAdd = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    type: [],
    createdAt: Timestamp.now().toDate(),
  });
  const {id}=useParams();
  const [selectedCheckbox, setSelectedCheckbox] = useState([]);

  const [progress, setProgress] = useState(0);

  const handleCheckChange = (id) => {
    const findIdx = selectedCheckbox.indexOf(id);

    let selected;
    if (findIdx > -1) {
      selected = selectedCheckbox.filter((checkboxId) => checkboxId !== id);
    } else {
      selected = [...selectedCheckbox, id];
    }
    setSelectedCheckbox(selected);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
          type: [],
        });

        getDownloadURL(uploadImage.snapshot.ref).then((url) => {
     if(!id){
      try{
        const blogRef = collection(db, "Blogs");
        // blogRef.where('type','array-contains-any',['a','b','c','d'])
        addDoc(blogRef, {
          title: formData.title,
          description: formData.description,
          type: formData.type,
          image: url,
          type: selectedCheckbox,
          createdAt: Timestamp.now().toDate(),
        });
        console
          .log("addDoc", addDoc)
          .then(() => {
            toast("Blog added successfully", { type: "success" });
            setProgress(0);
          })
          .catch((err) => {
            toast("Error adding article", { type: "error" });
          });
      }
      catch(error){
        console.log(error);
      }
    }
      else{
        const blogRef = collection(db, "Blogs",id);
        // blogRef.where('type','array-contains-any',['a','b','c','d'])
        updateDoc(blogRef, {
          title: formData.title,
          description: formData.description,
          type: formData.type,
          image: url,
          type: selectedCheckbox,
          createdAt: Timestamp.now().toDate(),
        });
        console
          .log("addDoc", addDoc)
          .then(() => {
            toast("Blog added successfully", { type: "success" });
            setProgress(0);
          })
          .catch((err) => {
            toast("Error adding article", { type: "error" });
          });
      }  
   
        });
      }
    );
  };

  useEffect(() => {
    id && getSingleUser();
  }, [id]);

  const getSingleUser = async () => {
    const docRef = doc(db, "Blogs", id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      setFormData({ ...snapshot, formData });
    }
  };

  return (
    <div className="border p-3 mt-3 bg-light" style={{ position: "fixed" }}>
      <>
        <h2>Create Blog</h2>
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
          {checkboxes.map((checkbox) => (
            <label key={checkbox.id}>
              {checkbox.text}
              <input
                type="checkbox"
                onChange={() => handleCheckChange(checkbox.text)}
                selected={selectedCheckbox.includes(checkbox.text)}
              />
            </label>
          ))}
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
