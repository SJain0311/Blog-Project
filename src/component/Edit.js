import React,{useState,useEffect} from 'react';
import {useParams} from "react-router-dom";
import { db } from "../firebaseConfig";
import { updateDoc,doc} from "firebase/firestore";


function Edit() {
  const {id} =useParams();
  const [title,setTitle]=useState('');
  const [description,setDescription]=useState('');
  const [ image,setImage]=useState('');

    
    useEffect( (id)=> {
      db.collection('Blogs').doc(db, "Blogs", id).getDoc().then((snapshot) => {
        const data = snapshot.data();
        setTitle(data.Title);
        setDescription(data.Body);
    });
    },[]);

    const sub = (e) => {
      e.preventDefault();
      const docRef = doc(db, "Blogs", id);
      updateDoc(docRef, {title:title,description:description})
      .then(docRef => {
          console.log("Data Successfully Updated");
      })
      .catch(error => {
          console.log(error);
      })
      console.log("id: ", id);
    }
  return (
    <div>
      <h1>hello</h1>
        <form onSubmit={(event) => {sub(event)}}>    
            <input type="text" placeholder="Title"  value={title}
            onChange={(e)=>{setTitle(e.target.value)}}  />

            <input  name="text" type="text" value={description}
            placeholder="write yoyr content here" 
            rows="10" cols="150" onChange={(e)=>{setDescription(e.target.value)}} required >
            </input>

            <button type="submit">Submit</button>
        </form>
    </div>
  )
}

export default Edit