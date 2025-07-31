const router = require("express").Router();

const UserBlogs = require("../models/user_blogs");

router.post("/", async (req, res, next) => {
  try {
    const userBlogs = await UserBlogs.create({
      ...req.body,
      read: false,
    });
    return res.json(userBlogs);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
