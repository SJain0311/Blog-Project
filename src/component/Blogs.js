import React, { useEffect, useState } from "react";
import { db, auth } from "../firebaseConfig";
import { useParams, useNavigate } from "react-router-dom";
import {
  getFirestore,
  collection,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  doc,
} from "firebase/firestore";
import Delete from "./Delete";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";

const Blog = () => {
  const { id } = useParams();
  let navigate = useNavigate();
  const [selectedCheckbox, setSelectedCheckbox] = useState([]);
  const [blogs, setBlog] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const blogRef = collection(db, "Blogs");
    const q = query(blogRef, orderBy("createdAt", "desc"));
    onSnapshot(q, (snapshot) => {
      const blogs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBlog(blogs);
      console.log("snapshot");
      console.log("blogs", blogs);
    });
  }, []);
  const db = getFirestore();

  const logout = async () => {
    navigate("/")
    await signOut(auth);
  };

  return (
    <div>
      <div style={{textAlign:'right'}} className="mt-2 mx-2">
      <Link to="/addBlog">
        <button className="btn btn-primary ">AddBlog</button>
      </Link>
      </div>
      <div className="search-box">
        <input
          id="search-box"
          onChange={(e) => setSearch(e.target.value)}
          className="search"
          placeholder="...Search"
        />
      </div>
      {blogs.length === 0 ? (
        <p>No Blogs found!</p>
      ) : (
        blogs
          .filter(
            (blog) =>
              blog.title
                .toString()
                .toLowerCase()
                .indexOf(search.toLowerCase()) !== -1
          )
          .map(
            ({
              id,
              title,
              description,
              image,
              type,
              createdAt,
              createdBy,
            }) => (
              <div className="border mt-3 p-3 bg-light" key={id}>
                <div className="row">
                  <div className="col-3">
                    <img
                      src={image}
                      alt="title"
                      style={{ height: 180, width: 180 }}
                    />
                  </div>
                  <div className="col-9 ps-3">
                    <div className="row">
                      <div className="col-6">
                        {createdBy && (
                          <span className="badge bg-primary">{createdBy}</span>
                        )}
                      </div>
                      <div className="col-6 d-flex flex-row-reverse">
                        <Delete id={id} image={image} />
                      </div>
                      <div className="col-6 d-flex flex-row-reverse">
                        {id && id === id && (
                          <button
                          className="btn btn-primary"
                            onClick={() =>
                              navigate("/addBlog/" + id, {id:id, title: title,description:description,image:image })
                            }
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    </div>
                    <h3>{title}</h3>
                    <h5>{description}</h5>
                    <h5>{type}</h5>
                  </div>
                </div>
         
              </div>
            )
          )
      )}
         <div className="mt-4 mx-4" style={{textAlign:'right'}}>
      <button className="btn btn-dark" onClick={logout} >
        SignOut
      </button>
      </div>
    </div>
  );
};
export default Blog;
