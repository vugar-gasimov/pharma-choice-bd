const express = require("express");
const router = express.Router();
const storeController = require("../controllers/storeController");

router
  .route("/")
  .get(storeController.getAllStores)
  .post(storeController.createNewStore)
  .patch(storeController.updateStore)
  .delete(storeController.deleteStore);
module.exports = router;
