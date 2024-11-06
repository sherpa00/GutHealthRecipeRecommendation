const ChatController = require("../controllers/chat.controller");

const router = require("express").Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Api is stable",
  });
});

router.get("/chat", async (req, res) => {
  const { userMessage } = req.body;

  const chat = await ChatController(userMessage);

  if (chat.success) {
    res.status(200).json({
      ...chat,
    });
  } else {
    res.status(400).json({
      ...chat,
    });
  }
});

module.exports = router;
