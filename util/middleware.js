const { User } = require("../models");
const Session = require("../models/session");
const { SECRET } = require("../util/config");
const jwt = require("jsonwebtoken");

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch (error) {
      return res.status(401).json({ error: "token invalid" });
    }
  } else {
    return res.status(401).json({ error: "token missing" });
  }
  next();
};

const validateSession = async (req, res, next) => {
  const token = req.get("authorization").substring(7);
  const session = await Session.findByPk(token);
  if (session) {
    const date = new Date();
    if (date > session.expires) {
      return res
        .status(401)
        .json({ error: "Unauthorized. Session has expired." });
    }
    next();
    return;
  }
  return res
    .status(401)
    .json({ error: "Unauthorized. Session does not exist." });
};

const validateUser = async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id);
  if (user.disabled === true) {
    return res.status(401).json({ error: "Unauthorized. User is disabled." });
  }
  next();
};

module.exports = { tokenExtractor, validateUser, validateSession };
