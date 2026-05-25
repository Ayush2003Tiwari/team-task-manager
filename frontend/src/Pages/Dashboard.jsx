import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Dashboard() {
  const userInfo = JSON.parse(
    localStorage.getItem("userInfo")
  );

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");
  const [dueDate, setDueDate] =
    useState("");
  const [projectId, setProjectId] =
    useState("");

  useEffect(() => {
    if (!userInfo) {
      window.location.href = "/login";
      return;
    }

    fetchProjects();
    fetchTasks();
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

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get(
        "https://team-task-manager-production-f2ec.up.railway.app/api/tasks"
      );

      setTasks(data);
    } catch (error) {
      console.log(error);
    }
  };

  const createTaskHandler = async () => {
    if (
      !title ||
      !description ||
      !dueDate ||
      !projectId
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      await axios.post(
        "https://team-task-manager-production-f2ec.up.railway.app/api/tasks",
        {
          title,
          description,
          dueDate,
          project: projectId,
        }
      );

      alert("Task Created Successfully");

      setTitle("");
      setDescription("");
      setDueDate("");
      setProjectId("");

      fetchTasks();
    } catch (error) {
      console.log(error);
      alert("Task creation failed");
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    window.location.href = "/login";
  };

  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <h1>Dashboard</h1>

        <h2 className="mt-4">
          Welcome User
        </h2>

        <button
          className="btn btn-danger mb-4"
          onClick={logoutHandler}
        >
          Logout
        </button>

        <hr />

        <div className="card p-4 mb-4">
          <h2>Create Task</h2>

          <input
            type="text"
            className="form-control mb-3"
            placeholder="Enter Task Title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />

          <input
            type="text"
            className="form-control mb-3"
            placeholder="Enter Description"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
          />

          <input
            type="date"
            className="form-control mb-3"
            value={dueDate}
            onChange={(e) =>
              setDueDate(e.target.value)
            }
          />

          <select
            className="form-control mb-3"
            value={projectId}
            onChange={(e) =>
              setProjectId(e.target.value)
            }
          >
            <option value="">
              Select Project
            </option>

            {projects.map((project) => (
              <option
                key={project._id}
                value={project._id}
              >
                {project.name}
              </option>
            ))}
          </select>

          <button
            className="btn btn-primary"
            onClick={createTaskHandler}
          >
            Create Task
          </button>
        </div>

        <h2>Your Tasks</h2>

        {tasks.length === 0 ? (
          <p>No Tasks Found</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task._id}
              className="card p-3 mb-3"
            >
              <h3>{task.title}</h3>

              <p>{task.description}</p>

              <p>
                <strong>Status:</strong>{" "}
                {task.status}
              </p>

              <p>
                <strong>Due:</strong>{" "}
                {new Date(
                  task.dueDate
                ).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Dashboard;