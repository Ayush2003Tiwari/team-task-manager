import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-dark bg-dark px-4">
      <Link
        to="/dashboard"
        className="navbar-brand"
      >
        Team Task Manager
      </Link>

      <div>
        <Link
          to="/dashboard"
          className="btn btn-outline-light me-2"
        >
          Dashboard
        </Link>

        <Link
          to="/projects"
          className="btn btn-outline-light"
        >
          Projects
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;