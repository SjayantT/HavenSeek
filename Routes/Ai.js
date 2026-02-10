const express = require("express");
const router = express.Router({mergeParams: true});
const AiController = require("../Controller/AiController.js");

router.post("/assistance", AiController.aiExample);

module.exports = router;