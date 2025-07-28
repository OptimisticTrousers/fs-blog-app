const express = require("express");
const app = express();

const { PORT } = require("./util/config");
const { connectToDatabase } = require("./util/db");

const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");

app.use(express.json());

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "SequelizeDatabaseError") {
    return response.status(400).send({ error: "'likes' is not a number." });
  } else if (error.name === "SequelizeValidationError") {
    return response
      .status(400)
      .send({ error: "'url' and 'title' must be provided." });
  }

  next(error);
};

app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
