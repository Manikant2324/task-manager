import { useState, useEffect } from "react";
import API from "../services/api";

function Users() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "member",
  });

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data.users || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Basic validation
      if (!formData.name || !formData.email || !formData.password) {
        alert("Name, email and password are required");
        return;
      }
      if (formData.password.length < 6) {
        alert("Password must be at least 6 characters");
        return;
      }

      await API.post("/users", formData);
      setFormData({ name: "", email: "", password: "", role: "member" });
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create user");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/users/${id}`);
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", padding: "40px" }}>
      <h1 style={{ color: "white", textAlign: "center", marginBottom: "30px" }}>
        User Management
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
          marginBottom: "30px",
        }}
      >
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ padding: "10px" }}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ padding: "10px" }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{ padding: "10px" }}
        />
        <select name="role" value={formData.role} onChange={handleChange} style={{ padding: "10px" }}>
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
        <button
          type="submit"
          style={{ padding: "12px", background: "#2563eb", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
        >
          Create User
        </button>
      </form>

      <div style={{ maxWidth: "700px", margin: "auto" }}>
        {users.map((user) => (
          <div
            key={user._id}
            style={{
              background: "white",
              padding: "15px",
              borderRadius: "10px",
              marginBottom: "15px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p><strong>{user.name}</strong></p>
              <p>{user.email}</p>
              <p>Role: {user.role}</p>
            </div>
            <button
              onClick={() => handleDelete(user._id)}
              style={{ padding: "8px 12px", background: "#dc2626", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Users;
