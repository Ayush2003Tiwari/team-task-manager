import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Projects() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const fetchProjects = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get(
        "http://localhost:5000/api/projects",
        config
      );

      setProjects(data);
    } catch (error) {
      console.log(error);
    }
  };

  const createProjectHandler = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.post(
        "http://localhost:5000/api/projects",
        {
          name,
          description,
        },
        config
      );

      fetchProjects();

      setName("");
      setDescription("");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

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

        {projects.map((project) => (
          <div
            key={project._id}
            className="card p-3 mb-3"
          >
            <h3>{project.name}</h3>

            <p>{project.description}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default Projects;