const Session = require("../models/session");
const { tokenExtractor } = require("../util/middleware");

const router = require("express").Router();

router.delete("/", tokenExtractor, async (request, response) => {
  const token = request.get("authorization").substring(7);
  await Session.destroy({
    where: {
      token,
    },
  });

  response.status(204).end();
});

module.exports = router;
