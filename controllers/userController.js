const generateToken = require("../generateToken");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const cloudinary = require("../utils/cloudinary");

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  
  const newUser = new User({
    name,
    email,
    password,
    image: req.file.path,
  });
  newUser
    .save()
    .then(() => {
      res.status(200).json({ message: "User registered successfully" });
    })
    .catch((err) => {
      console.log("Error: ", err);
      res.status(500).json({ message: "Error registering the user" });
    });
});

const login = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(404)
        .json({ message: "Email and Password are required" });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!(await user.matchPassword(password))) {
      return res.status(404).json({ message: "Invalid Password" });
    }
    const token = generateToken(user._id);
    res.status(200).json({
      token: token,
      userId: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
    });
  } catch (error) {
    console.log("Error in finding the user", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Fetch all users except loggen in user

const fetchUser = asyncHandler(async (req, res) => {
  try {
    const loogedInUserId = req.params.userId;
    const users = await User.find({ _id: { $ne: loogedInUserId } });
    res.status(200).json(users);
  } catch (error) {
    console.log("error in retrieving users");
    return res.status(500).json({ message: "Error in retreiving users" });
  }
});

// endpoint to send a request to a user

const friendRequest = asyncHandler(async (req, res) => {
  const { currentUserId, selectedUserId } = req.body;
  try {
    // Update recipient's friend request array
    const recipientUser = await User.findByIdAndUpdate(selectedUserId, {
      $addToSet: { friendRequests: currentUserId },
    });

    if (!recipientUser) {
      return res.status(404).json({ message: "Recipient user not found" });
    }

    // Update sender's sent friend request array
    const senderUser = await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { sentFriendRequests: selectedUserId },
    });

    if (!senderUser) {
      return res.status(404).json({ message: "Sender user not found" });
    }

    res.sendStatus(200);
  } catch (error) {
    return res.status(500).json({ message: "Error in sending request" });
  }
});

// fetch all sent friendrequest

const fetchSentFriendRequests = asyncHandler(async (req, res) => {
  try {
    const loggedInUserId = req.params.userId;
    const users = await User.findById(loggedInUserId);
    const friendRequestsSent = users.sentFriendRequests;
    if (!friendRequestsSent) {
      return res.status(404).json({ message: "No request sent" });
    }
    res.status(200).json(friendRequestsSent);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error in fetching friend requests" });
  }
});

// Fetch all friend requests received
const fetchFriendRequests = asyncHandler(async (req, res) => {
  try {
    const loggedInUserId = req.params.userId;
    const user = await User.findById(loggedInUserId).populate(
      "friendRequests",
      "name email image"
    );
    const friendRequest = user.friendRequests;
    res.status(200).json(friendRequest);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// endpoint to accept friend request

const acceptRequest = asyncHandler(async (req, res) => {
  try {
    const { senderId, recepientId } = req.body;

    const sender = await User.findById(senderId);
    const recepient = await User.findById(recepientId);
    if (!sender.friends.includes(recepientId)) {
      sender.friends.push(recepientId);
    }

    if (!recepient.friends.includes(senderId)) {
      recepient.friends.push(senderId);
    }

    sender.sentFriendRequests = sender.sentFriendRequests.filter(
      (request) => request.toString() !== recepientId.toString()
    );

    recepient.friendRequests = recepient.friendRequests.filter(
      (request) => request.toString() !== senderId.toString()
    );

    await sender.save();
    await recepient.save();

    res.status(200).json({ message: "Friend Request accepted" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

//endpoint to fect all friends

const fetchFriends = asyncHandler(async (req, res) => {
  try {
    const loggedInUserId = req.params.userId;
    const user = await User.findById(loggedInUserId).populate(
      "friends",
      "name email image"
    );
    const friends = user.friends;
    res.status(200).json(friends);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// endpoint to fetch details of particular user

const fetchUserDetails = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    const userDetails = await User.findById(userId);
    res.status(200).json(userDetails);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = {
  login,
  register,
  fetchUser,
  friendRequest,
  fetchSentFriendRequests,
  fetchFriendRequests,
  acceptRequest,
  fetchFriends,
  fetchUserDetails,
};
