import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { FaHome, FaInfoCircle, FaUser } from "react-icons/fa";
import LoginPage from "./pages/login";

function Home() {
  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold">Home Page <FaHome className="inline ml-2" /></h1>
      <p className="mt-2">Welcome to the home page!</p>
    </div>
  );
}

function About() {
  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold">About Page <FaInfoCircle className="inline ml-2" /></h1>
      <p className="mt-2">This is the about section.</p>
    </div>
  );
}

function Profile() {
  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold">Profile Page <FaUser className="inline ml-2" /></h1>
      <p className="mt-2">Here is your profile info.</p>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <nav className="flex gap-6 p-4 bg-gray-200 shadow-md">
        <Link to="/" className="flex items-center gap-2 hover:text-blue-600">
          <FaHome /> Home
        </Link>
        <Link to="/about" className="flex items-center gap-2 hover:text-blue-600">
          <FaInfoCircle /> About
        </Link>
        <Link to="/profile" className="flex items-center gap-2 hover:text-blue-600">
          <FaUser /> Profile
        </Link>
      </nav>

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}
