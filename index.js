require("dotenv").config();
const { QueryTypes, Model, DataTypes, Sequelize } = require("sequelize");
const express = require("express");
const app = express();

app.use(express.json());

const sequelize = new Sequelize(process.env.DATABASE_URL);

class Blog extends Model {}
Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: DataTypes.TEXT,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  { sequelize, underscored: true, timestamps: false, modelName: "blog" }
);

Blog.sync();

app.get("/api/blogs", async (req, res) => {
  const blogs = await Blog.findAll();
  console.log(JSON.stringify(blogs, null, 2));
  res.json(blogs);
});

app.post("/api/blogs", async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    return res.json(blog);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

app.get("/api/blogs/:id", async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (blog) {
    console.log(blog.toJSON());
    res.json(blog);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/blogs/:id", async (req, res) => {
  await Blog.destroy({
    where: {
      id: req.params.id,
    },
  });
  res.status(204).end();
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
