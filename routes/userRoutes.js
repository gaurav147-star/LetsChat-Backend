const express = require("express");
const router = express.Router();
const { route } = require("express/lib/router");
const {
  login,
  register,
  fetchUser,
  friendRequest,
  fetchSentFriendRequests,
  fetchFriendRequests,
  acceptRequest,
  fetchFriends,
  fetchUserDetails
} = require("../controllers/userController");
const { protect } = require("../middlewares/authModdleware");
const multer = require("multer");

const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary')
console.log(cloudinary)
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'profile',
      allowed_formats: ['jpg', 'jpeg', 'png'],
    //   transformation: [{ width: 500, height: 500, crop: 'limit' }],
    },
  });
  
  const upload = multer({ storage });

router.post("/register", upload.single('image'),register);
router.post("/login", login);
router.route("/users/:userId").get(protect, fetchUser);
router.post("/friend-request", friendRequest);
router.get("/friend-request/sent/:userId", fetchSentFriendRequests);
router.get("/friend-request/:userId", fetchFriendRequests);
router.post("/friend-request/accept", acceptRequest);
router.get("/friends/:userId", fetchFriends);
router.get("/:userId", fetchUserDetails);

module.exports = router;
