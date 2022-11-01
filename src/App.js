import logo from './logo.svg';
import './App.css';
import Blog from './component/Blogs';
import BlogAdd from './component/BlogAdd';

function App() {
  return (
    <div className='row mt-5'>
    <div className="col-md-8">
     <Blog/>
     </div>
     <div className="col-md-4">
     <BlogAdd/>
    </div>
    </div>
  );
}

export default App;
