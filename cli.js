require("dotenv").config();
const { QueryTypes, Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL);

const main = async () => {
  try {
    await sequelize.authenticate();
    const blogs = await sequelize.query("SELECT * FROM blogs", {
      type: QueryTypes.SELECT,
    });
    for (let i = 0; i < blogs.length; i++) {
      const blog = blogs[i];
      console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`);
    }
    sequelize.close();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

main();
