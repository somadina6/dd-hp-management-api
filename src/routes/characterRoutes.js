const express = require("express");
const router = express.Router();
const characterController = require("../controllers/characterController");

router.get("/:filename/status", characterController.getStatus);
router.post("/:filename/damage", characterController.dealDamage);
router.post("/:filename/heal", characterController.heal);
router.post("/:filename/temporary-hp", characterController.addTemporaryHP);

module.exports = router;
