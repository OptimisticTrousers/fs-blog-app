const router = require("express").Router();

const { ReadingList } = require("../models");
const { tokenExtractor } = require("../util/middleware");

router.post("/", async (req, res, next) => {
  try {
    const readingList = await ReadingList.create({
      ...req.body,
      read: false,
    });
    return res.json(readingList);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", tokenExtractor, async (req, res, next) => {
  try {
    const readingList = await ReadingList.findOne({
      where: {
        userId: req.decodedToken.id,
        id: req.params.id,
      },
    });
    if (readingList) {
      readingList.read = req.body.read;
      await readingList.save();
      return res.json(readingList);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
