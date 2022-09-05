import './App.css';
import { BrowserRouter, Routes, Route} from "react-router-dom";
import Home from './Pages/Home';
import Folder from './Pages/Folder';
import LandingPage from './Pages/LandingPage';

function App() {
  return (
    <div className="App">
      <div className="container">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage/>} />
            <Route path="/folders" element={<Home/>} />
            <Route path="/folder/:id" element={<Folder/>} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
