import { useState, useEffect } from "react";
import API from "../services/api";

function Dashboard() {

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "pending",
  });

  const [tasks, setTasks] = useState([]);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const fetchTasks = async () => {

    try {

      const res = await API.get("/tasks");

      setTasks(res.data);

    }

    catch (error) {

      console.log(error);

    }

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await API.post(
        "/tasks",
        formData
      );

      alert("Task Created");

      fetchTasks();

      setFormData({
        title: "",
        description: "",
        priority: "medium",
        status: "pending",
      });

    }

    catch (error) {

      alert("Error creating task");

    }

  };

  useEffect(() => {

    fetchTasks();

  }, []);

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        padding: "40px",
      }}
    >

      <h1
        style={{
          color: "white",
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        Task Dashboard
      </h1>

      <form
        onSubmit={handleSubmit}
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "10px",
          maxWidth: "500px",
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >

        <input
          type="text"
          name="title"
          placeholder="Task title"
          value={formData.title}
          onChange={handleChange}
          required
          style={{
            padding: "10px",
          }}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          style={{
            padding: "10px",
            height: "100px",
          }}
        />

        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          style={{
            padding: "10px",
          }}
        >

          <option value="low">
            Low
          </option>

          <option value="medium">
            Medium
          </option>

          <option value="high">
            High
          </option>

        </select>

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          style={{
            padding: "10px",
          }}
        >

          <option value="pending">
            Pending
          </option>

          <option value="completed">
            Completed
          </option>

        </select>

        <button
          type="submit"
          style={{
            padding: "12px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Create Task
        </button>

      </form>

      <div
        style={{
          marginTop: "30px",
          maxWidth: "500px",
          marginInline: "auto",
        }}
      >

        {
          tasks.map((task) => (

            <div
              key={task._id}
              style={{
                background: "white",
                padding: "15px",
                borderRadius: "10px",
                marginBottom: "15px",
              }}
            >

              <h3>
                {task.title}
              </h3>

              <p>
                {task.description}
              </p>

              <p>
                Priority: {task.priority}
              </p>

              <p>
                Status: {task.status}
              </p>

            </div>

          ))
        }

      </div>

    </div>

  );

}

export default Dashboard;