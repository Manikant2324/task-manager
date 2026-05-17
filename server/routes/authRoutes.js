import express from "express";

const router = express.Router();

router.post("/register", (req, res) => {

  const { email, password } = req.body;

  res.json({
    message: "Register Success",
    user: {
      email,
    },
  });

});

router.post("/login", (req, res) => {

  const { email, password } = req.body;

  if (
    email === "test@gmail.com" &&
    password === "123456"
  ) {

    res.json({
      token: "sampletoken",
      user: {
        email,
      },
    });

  } else {

    res.status(401).json({
      message: "Invalid Credentials",
    });

  }

});

export default router;