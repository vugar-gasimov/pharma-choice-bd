const express = require("express");
const router = express.Router();
const couponsController = require("../controllers/couponsController");

router
  .route("/")
  .get(couponsController.getAllCoupons)
  .post(couponsController.createNewCoupon)
  .patch(couponsController.updateCoupon)
  .delete(couponsController.deleteCoupon);
module.exports = router;
