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
import { useParams, useNavigate } from "react-router-dom";

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
  const { id } = useParams();
  let navigate = useNavigate();
  const[update,setUpdate] = useState()
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
    console.log("called image ")
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handlePublish = () => {
    navigate("/blog");
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
          // image([url]);
        //   updateDoc(auth.currentUser, { image: `${image[0]}` }).then(() => {
        //     image(image[0]);
        //   });
          if (!id) {
            try {
              const blogRef = collection(db, "Blogs");
            
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
                  // navigate("/blog")
                })
                .catch((err) => {
                  toast("Error adding article", { type: "error" });
                });
            } catch (error) {
              console.log(error);
            }
          } else {
            console.log("Update here");
            const editRef = doc(db, "Blogs", id);
            updateDoc(editRef, {
              id: id,
              title: formData.title,
              description: formData.description,
              type: formData.type,
              image: url,
              type: selectedCheckbox,
              createdAt: Timestamp.now().toDate(),
            });
            console.log("Update here");
            console
              .log("addDoc", updateDoc)
              .then(() => {
                toast("Blog updateDoc successfully", { type: "success" });
                setProgress(0);
              })
              .catch((err) => {
                toast("Error updateDoc article", { type: "error" });
              });
          }
        });
      }
    );
    }

  useEffect(() => {
    id && getSingleUser();
    console.log("hello", id);
  }, [id]);

  const getSingleUser = async () => {
    const docRef = doc(db, "Blogs", id);
    const snapshot = await getDoc(docRef);
  
    if (snapshot.exists()) {
      setFormData({ ...snapshot.data() });
    } 
  };

  return (
    <div className="border p-3 mt-3 bg-light" style={{ position: "fixed" }}>
      <>
        {id ? "Update Blog" : "Create Blog"}
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
              value={checkbox.id}
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
          {id ? "Update" : "Submit"}
        </button>
      </>
    </div>
  );
};

export default BlogAdd;
