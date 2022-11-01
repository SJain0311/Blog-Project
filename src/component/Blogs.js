import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { useParams } from "react-router-dom";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import Delete from "./Delete";
import { type } from "@testing-library/user-event/dist/type";

const Blog = () => {
  const { id } = useParams();
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
      console.log("blogs", blogs);
    });
  }, []);

  return (
    <div>
           {blogs.length === 0 ? (
        <p>No articles found!</p>
      ) : (
        blogs.map(
          ({
            id,
            title,
            description,
            image,
            type:
            createdAt,
            createdBy,
            userId,
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
                      {/* {user && user.uid === userId && ( */}{}
                        <Delete id={id} image={image} />
                      {/* )} */}
                    </div>
                  </div>
                  <h3>{title}</h3>
                  {/* <p>{createdAt.toDate().toDateString()}</p> */}
                  <h5>{description}</h5>
                  <h5>{type}</h5>

                </div>
              </div>
            </div>
          )
        )
      )}
    </div>
    // <div className="" style={{ marginTop: 50 }}>
    //   <div className="search-box">
    //     <input
    //       id="search-box"
    //       onChange={(e) => setSearch(e.target.value)}
    //       className="search"
    //       placeholder="...Search"
    //     />
    //   </div>
    //   {blogs
    //     .filter(
    //       (blog) =>
    //         blog.title
    //           .toString()
    //           .toLowerCase()
    //           .indexOf(search.toLowerCase()) !== -1
    //     )
    //     .map((blog) => (
    //       <div className="row container border bg-light">
    //         <div className="col-3">
    //           <img src={blog.image} style={{ width: "100%", padding: 10 }} />
    //         </div>
    //         <div className="col-9 mt-3">
    //           <h2>{blog.title}</h2>
    //           <hr />
    //           <h4>{blog.description}</h4>
    //           <h4>{blog.type}</h4>
    //         </div>
    //       </div>
    //     ))}
    // </div>
  );
};
export default Blog;
