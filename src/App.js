import logo from "./logo.svg";
import "./App.css";
import Blog from "./component/Blogs";
import BlogAdd from "./component/BlogAdd";
import Navbar from "./component/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./component/Login";
import SignUp from "./component/SignUp";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
       <Route path="/blog" element={<Blog/>}></Route>
       <Route path="/addBlog" element={<BlogAdd/>}></Route>
       <Route path="/addBlog/:id" element={<BlogAdd/>}></Route>
       <Route path="/SignUp" element={<SignUp/>}></Route>
      </Routes>
      {/* <Navbar /> */}
    </Router>
    
  );
}

export default App;
