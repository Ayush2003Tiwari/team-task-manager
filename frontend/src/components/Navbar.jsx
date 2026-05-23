import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
      <div className="container">
        <Link
          className="navbar-brand"
          to="/dashboard"
        >
          Team Task Manager
        </Link>

        <div>
          <Link
            className="btn btn-outline-light me-2"
            to="/dashboard"
          >
            Dashboard
          </Link>

          <Link
            className="btn btn-outline-light"
            to="/projects"
          >
            Projects
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;