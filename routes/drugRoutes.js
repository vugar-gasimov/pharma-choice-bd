const express = require("express");
const router = express.Router();
const drugsController = require("../controllers/drugsController");

router
  .route("/")
  .get(drugsController.getAllDrugs)
  .post(drugsController.createNewDrug)
  .patch(drugsController.updateDrug)
  .delete(drugsController.deleteDrug);
module.exports = router;
