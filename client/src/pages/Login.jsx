import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await API.post(
        "/auth/login",
        formData
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      navigate("/dashboard");

    }

    catch (error) {

      alert(
        error.response?.data?.message
        || "Login Failed"
      );

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-slate-900">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-2xl w-[350px] space-y-5"
      >

        <h1 className="text-3xl font-bold text-center text-slate-800">
          Login
        </h1>

        <input
          type="email"
          name="email"
          placeholder="Enter email"
          onChange={handleChange}
          className="w-full border p-3 rounded-lg outline-none focus:border-blue-500"
        />

        <input
          type="password"
          name="password"
          placeholder="Enter password"
          onChange={handleChange}
          className="w-full border p-3 rounded-lg outline-none focus:border-blue-500"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-all"
        >
          Login
        </button>

      </form>

    </div>

  );

}

export default Login;