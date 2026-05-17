import { useState } from "react";

import API from "../services/api";

import { useNavigate } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({

      name: "",
      email: "",
      password: "",

    });

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
      e.target.value,

    });

  };

  const handleSubmit =
  async (e) => {

    e.preventDefault();

    try {

      await API.post(

        "/auth/register",

        formData

      );

      alert(
        "Registration Success"
      );

      navigate("/");

    }

    catch (error) {

      alert(

        error.response?.data?.message
        || "Register Failed"

      );

    }

  };

  return (

    <div

      style={{

        height: "100vh",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        background: "#0f172a",

      }}

    >

      <form

        onSubmit={handleSubmit}

        style={{

          background: "white",

          padding: "30px",

          borderRadius: "12px",

          width: "320px",

          display: "flex",

          flexDirection: "column",

          gap: "15px",

          boxShadow:
          "0 0 10px rgba(0,0,0,0.3)",

        }}

      >

        <h2

          style={{

            textAlign: "center",

            color: "black",

          }}

        >

          Register

        </h2>

        <input

          type="text"

          name="name"

          placeholder="Enter name"

          onChange={handleChange}

          required

          style={{

            padding: "10px",

            border:
            "1px solid gray",

            borderRadius: "5px",

            background: "white",

            color: "black",

          }}

        />

        <input

          type="email"

          name="email"

          placeholder="Enter email"

          onChange={handleChange}

          required

          style={{

            padding: "10px",

            border:
            "1px solid gray",

            borderRadius: "5px",

            background: "white",

            color: "black",

          }}

        />

        <input

          type="password"

          name="password"

          placeholder="Enter password"

          onChange={handleChange}

          required

          style={{

            padding: "10px",

            border:
            "1px solid gray",

            borderRadius: "5px",

            background: "white",

            color: "black",

          }}

        />

        <button

          type="submit"

          style={{

            padding: "10px",

            background: "#2563eb",

            color: "white",

            border: "none",

            borderRadius: "5px",

            cursor: "pointer",

            fontSize: "16px",

          }}

        >

          Register

        </button>

      </form>

    </div>

  );

}

export default Register;