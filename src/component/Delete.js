
import { deleteDoc, doc } from "firebase/firestore";
import React from "react";
import { db, storage } from "../firebaseConfig";
import { toast } from "react-toastify";
import { deleteObject, ref } from "firebase/storage";

const Delete = (id, image) => {
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await deleteDoc(doc(db, "Blogs", id.id));
        console.log("delete handle",deleteDoc)
        toast("Blog deleted successfully", { type: "success" });
        // const storageRef = ref(storage, image);
        // await deleteObject(storageRef);
      } catch (error) {
        toast("Error deleting article", { type: "error" });
        console.log(error);
      }
    }
  };
  return (
    <div>
      <i
        className="fa fa-times"
        onClick={handleDelete}
        style={{ cursor: "pointer" }}
      />
    </div>
  );
};

export default Delete;
