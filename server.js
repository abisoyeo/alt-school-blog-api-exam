require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
