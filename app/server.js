const PORT = require("./configs/env_vars.js");
const app = require("./index.js");

// application server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});
