const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const authRoutes =
require("./routes/authRoutes");

const taskRoutes =
require("./routes/taskRoutes");

const userRoutes =
require("./routes/userRoutes");

const setupSwagger = require("./swagger");

const app = express();

app.use(cors());

app.use(express.json());

app.use(
  "/uploads",
  express.static("uploads")
);

mongoose.connect(
  process.env.MONGO_URI
)

.then(() => {

  console.log(
    "MongoDB Connected"
  );

})

.catch((err) => {

  console.log(err);

});

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/tasks",
  taskRoutes
);

setupSwagger(app);

const PORT =
process.env.PORT || 5000;
const server = () => {
  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
};

if (require.main === module) {
  server();
}

module.exports = app;