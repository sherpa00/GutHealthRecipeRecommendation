const dotenv = require("dotenv");
const app = require("./index.js");

dotenv.config();

const PORT = process.env.PORT;

// application server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});
