import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function Projects() {
  const navigate = useNavigate();

  const userInfo = JSON.parse(
    localStorage.getItem("userInfo")
  );

  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");

  useEffect(() => {
    if (!userInfo) {
      navigate("/");
      return;
    }

    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await axios.get(
        "https://team-task-manager-production-f2ec.up.railway.app/api/projects"
      );

      setProjects(data);
    } catch (error) {
      console.log(error);
    }
  };

  const createProjectHandler = async () => {
    if (!name || !description) {
      alert("Please fill all fields");
      return;
    }

    try {
      await axios.post(
        "https://team-task-manager-production-f2ec.up.railway.app/api/projects",
        {
          name,
          description,
        }
      );

      alert("Project Created");

      setName("");
      setDescription("");

      fetchProjects();
    } catch (error) {
      console.log(error);
      alert("Project creation failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <h1 className="mb-4">Projects</h1>

        <div className="card p-4 mb-4">
          <h3 className="mb-3">
            Create Project
          </h3>

          <input
            type="text"
            className="form-control mb-3"
            placeholder="Enter Project Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          <input
            type="text"
            className="form-control mb-3"
            placeholder="Enter Description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />

          <button
            className="btn btn-primary"
            onClick={createProjectHandler}
          >
            Create Project
          </button>
        </div>

        <h2 className="mb-3">All Projects</h2>

        {projects.length === 0 ? (
          <p>No Projects Found</p>
        ) : (
          projects.map((project) => (
            <div
              key={project._id}
              className="card p-3 mb-3"
            >
              <h3>{project.name}</h3>

              <p>{project.description}</p>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Projects;
