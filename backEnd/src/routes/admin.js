const express = require("express");
const router = express.Router();

router.get("/home", (req, res) => {
  console.log("home", req);
  res.send('home')
});

module.exports = router;
