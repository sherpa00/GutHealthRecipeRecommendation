const router = require("express").Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    data: "hello",
  });
});

module.exports = router;
