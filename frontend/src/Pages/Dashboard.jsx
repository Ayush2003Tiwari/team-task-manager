import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Dashboard() {
  const userInfo =
    JSON.parse(localStorage.getItem("userInfo")) || {};

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [selectedProject, setSelectedProject] =
    useState("");

  const [filterProject, setFilterProject] =
    useState("all");

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    window.location.href = "/";
  };

  const fetchTasks = async () => {
    try {
      if (!userInfo?.token) return;

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };

      const { data } = await axios.get(
        "https://team-task-manager-production-f2ec.up.railway.app/api/tasks",
        config
      );

      setTasks(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProjects = async () => {
    try {
      if (!userInfo?.token) return;

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };

      const { data } = await axios.get(
        "https://team-task-manager-production-f2ec.up.railway.app/api/projects",
        config
      );

      setProjects(data);

      if (data.length > 0) {
        setSelectedProject(data[0]._id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createTaskHandler = async () => {
    try {
      if (!userInfo?.token) {
        alert("Please login again");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };

      await axios.post(
        "https://team-task-manager-production-f2ec.up.railway.app/api/tasks",
        {
          title,
          description,
          dueDate,
          project: selectedProject,
        },
        config
      );

      alert("Task Created Successfully");

      fetchTasks();

      setTitle("");
      setDescription("");
      setDueDate("");
    } catch (error) {
      console.log(error);
      alert("Task Creation Failed");
    }
  };

  const deleteTaskHandler = async (id) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };

      await axios.delete(
        `https://team-task-manager-production-f2ec.up.railway.app/api/tasks/${id}`,
        config
      );

      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const completeTaskHandler = async (id) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };

      await axios.put(
        `https://team-task-manager-production-f2ec.up.railway.app/api/tasks/${id}`,
        {
          status: "Completed",
        },
        config
      );

      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, []);

  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <h1 className="mb-4">Dashboard</h1>

        <h2 className="mb-3">
          Welcome {userInfo?.name || "User"}
        </h2>

        <button
          className="btn btn-danger mb-4"
          onClick={logoutHandler}
        >
          Logout
        </button>

        <hr />

        <div className="card p-4 mb-4">
          <h3 className="mb-3">Create Task</h3>

          <input
            type="text"
            className="form-control mb-3"
            placeholder="Enter Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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

          <input
            type="date"
            className="form-control mb-3"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <select
            className="form-control mb-3"
            value={selectedProject}
            onChange={(e) =>
              setSelectedProject(e.target.value)
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

        <h2 className="mb-3">Your Tasks</h2>

        <select
          className="form-control mb-4"
          value={filterProject}
          onChange={(e) =>
            setFilterProject(e.target.value)
          }
        >
          <option value="all">
            All Projects
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

        {tasks
          .filter((task) =>
            filterProject === "all"
              ? true
              : task.project?._id ===
                filterProject
          )
          .map((task) => {
            const overdue =
              new Date(task.dueDate) < new Date() &&
              task.status !== "Completed";

            return (
              <div
                key={task._id}
                className="card p-3 mb-3"
              >
                <h3>{task.title}</h3>

                <p>{task.description}</p>

                <p>
                  <strong>Project:</strong>{" "}
                  {task.project?.name}
                </p>

                <p>
                  <strong>Due Date:</strong>{" "}
                  {task.dueDate
                    ? new Date(
                        task.dueDate
                      ).toLocaleDateString()
                    : "No Date"}
                </p>

                {overdue && (
                  <p style={{ color: "red" }}>
                    ⚠ Overdue Task
                  </p>
                )}

                <p
                  style={{
                    color:
                      task.status === "Completed"
                        ? "green"
                        : task.status ===
                          "In Progress"
                        ? "orange"
                        : "red",
                    fontWeight: "bold",
                  }}
                >
                  Status: {task.status}
                </p>

                <div>
                  <button
                    className="btn btn-danger me-2"
                    onClick={() =>
                      deleteTaskHandler(
                        task._id
                      )
                    }
                  >
                    Delete
                  </button>

                  <button
                    className="btn btn-success"
                    onClick={() =>
                      completeTaskHandler(
                        task._id
                      )
                    }
                  >
                    Mark Completed
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
}

export default Dashboard;