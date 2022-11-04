import logo from './logo.svg';
import './App.css';
import Blog from './component/Blogs';
import BlogAdd from './component/BlogAdd';
import Navbar from './component/Navbar';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from './component/Login';


function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/blog"
        element={
          <div className="row mt-5">
            <div className="col-md-8">
              <Blog />
            </div>
            <div className="col-md-4">
              <BlogAdd />
            </div>
          </div>
        }
      />
    </Routes>
    {/* <Navbar /> */}
  </Router>
//     <div className='row mt-5'>
//     <div className="col-md-8">
// <Login/>
//      {/* <Blog/> */}
//      </div>
//      <div className="col-md-4">
//      {/* <BlogAdd/> */}
//     </div>
//     </div>
  );
}

export default App;
