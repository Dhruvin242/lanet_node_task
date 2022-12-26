const express = require("express");
const bikeTypeRouter = require("../controller/bikeTypeContoller");
const { protect } = require("../controller/userAuthContoller");
const router = express.Router();

router
  .route("/")
  .post(bikeTypeRouter.creteBikeType)
  .get(bikeTypeRouter.getAllBikeTypes);

router.get("/single", bikeTypeRouter.getSingleBikeType);

router
  .route("/:id")
  .patch(bikeTypeRouter.updateBikeType)
  .delete(bikeTypeRouter.deleteBikeType);

module.exports = router;
