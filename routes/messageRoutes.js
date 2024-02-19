const express = require("express");
const { fetchMessage } = require("../controllers/messageController");
const messageController = require("../controllers/messageController")
const multer = require("multer");
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');


const router = express.Router();
console.log(cloudinary)
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'messages',
      allowed_formats: ['jpg', 'jpeg', 'png'],
    //   transformation: [{ width: 500, height: 500, crop: 'limit' }],
    },
  });
  
  const upload = multer({ storage });

router.post("/messages",upload.single('image'),messageController.messages)
router.get("/messages/:senderId/:receiverId",fetchMessage)

module.exports = router