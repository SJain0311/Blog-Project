import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { useParams } from "react-router-dom";
import { getFirestore,collection, onSnapshot, orderBy, query ,updateDoc,doc} from "firebase/firestore";
import Delete from "./Delete";
import Edit from "./Edit";

const Blog = () => {
  const { id } = useParams();
  const [openAddModal, setOpenAddModal] = useState(false);
  const [tasks, setTasks] = useState([]);
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
  const db = getFirestore();
  
  return (
    <div>
      <div className="search-box">
        <input
          id="search-box"
          onChange={(e) => setSearch(e.target.value)}
          className="search"
          placeholder="...Search"
        />
      </div>
      {blogs.length === 0 ? (
        <p>No articles found!</p>
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
              type: createdAt,
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
                     
                        <Delete id={id} image={image} />
                      </div>
                      <div className="col-6 d-flex flex-row-reverse">
                        <button
                          onClick={() => {
                            const docRef = doc(db, "Blogs", id);
                            updateDoc(docRef, {title:title})
                            .then(docRef => {
                                console.log("A New Document Field has been added to an existing document");
                            })
                            .catch(error => {
                                console.log(error);
                            })
                            console.log("id: ", id);
                          }}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                    <h3>{title}</h3>                  
                    <h5>{description}</h5>
                  </div>
                </div>
              </div>
            )
          )
      )}
    </div>
  );
};
export default Blog;