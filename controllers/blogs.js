const { Op } = require("sequelize");
const router = require("express").Router();

const { Blog, User } = require("../models");
const {
  tokenExtractor,
  validateSession,
  validateUser,
} = require("../util/middleware");

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

router.get("/", async (req, res) => {
  const where = {};

  if (req.query.search) {
    where[Op.or] = [
      {
        title: {
          [Op.iLike]: `%${req.query.search}%`,
        },
      },
      {
        author: {
          [Op.iLike]: `%${req.query.search}%`,
        },
      },
    ];
  }
  const blogs = await Blog.findAll({
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
      attributes: ["name"],
    },
    where,
    order: [["likes", "DESC"]],
  });
  console.log(JSON.stringify(blogs, null, 2));
  res.json(blogs);
});

router.post(
  "/",
  tokenExtractor,
  validateUser,
  validateSession,
  async (req, res, next) => {
    try {
      const user = await User.findByPk(req.decodedToken.id);
      const blog = await Blog.create({
        ...req.body,
        userId: user.id,
        date: new Date(),
      });
      return res.json(blog);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    console.log(req.blog.toJSON());
    res.json(req.blog);
  } else {
    res.status(404).end();
  }
});

router.put(
  "/:id",
  blogFinder,
  tokenExtractor,
  validateUser,
  validateSession,
  async (req, res, next) => {
    if (req.blog) {
      try {
        req.blog.likes = req.body.likes;
        await req.blog.save();
        res.json({ likes: req.blog.likes });
      } catch (error) {
        next(error);
      }
    } else {
      res.status(404).end();
    }
  }
);

router.delete(
  "/:id",
  tokenExtractor,
  validateUser,
  validateSession,
  async (req, res) => {
    const blog = await Blog.findOne({
      where: {
        userId: req.decodedToken.id,
        id: req.params.id,
      },
    });
    if (!blog) {
      return res.status(404).end();
    }
    await Blog.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(204).end();
  }
);

module.exports = router;
