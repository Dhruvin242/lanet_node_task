const express = require("express");
const bikeRouter = require("../controller/bikeContorller");
const { protect } = require("../controller/userAuthContoller");
const router = express.Router();

router
  .route("/get-recent-bikes")
  .get(bikeRouter.aliasRecentBike, bikeRouter.getAllBikes);

router
  .route("/get-top-like-bikes")
  .get(bikeRouter.TopLikeBike, bikeRouter.getAllBikes);

router.get("/getAllBikes", bikeRouter.getAllBikes);
router.get("/getAllBikes/search", bikeRouter.advanseSearch);
router.get("/getBikesByType", bikeRouter.getBikeByType);

router.get("/getUserBike", protect,bikeRouter.userCreatedBike);

router.post("/createBike", protect, bikeRouter.createBike);
router.route("/getBike/:bikeId").get(protect, bikeRouter.getBike);
router.route("/getBike/like").post(protect, bikeRouter.setlike);
router.route("/getBike/dislike").post(protect, bikeRouter.setdislike);
router.route("/updateBike/:bikeId").patch(protect, bikeRouter.updateBike);
router.route("/deleteBike/:bikeId").delete(protect, bikeRouter.deleteBike);

router.route("/totalLikes/:bikeId").get(protect, bikeRouter.getTotalLikes);


module.exports = router;
