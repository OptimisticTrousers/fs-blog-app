const Blog = require("./blog");
const User = require("./user");
const ReadingList = require("./readinglist");

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Blog, { through: ReadingList, as: "readings" });
Blog.belongsToMany(User, { through: ReadingList, as: "user_readings" });
User.hasMany(ReadingList, { as: "readinglists" });
ReadingList.belongsTo(User);
Blog.hasMany(ReadingList, { as: "readinglists" });
ReadingList.belongsTo(Blog);

module.exports = {
  Blog,
  User,
  ReadingList,
};
