import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

export const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password');
    res.status(200).json(users);
});

export const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});


export const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        if (user.role === 'admin') {
            res.status(400);
            throw new Error('Cannot delete an admin user');
        }
        await user.deleteOne();
        res.status(200).json({ message: 'User removed successfully' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});
export const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
  
    if (user) {
      user.username = req.body.username || user.username;
      const updatedUser = await user.save();
  
      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  });
  export const updateUserProfilePicture = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
  
    if (user) {
      if (req.file) {
        if (user.avatar && user.avatar.public_id) {
          await cloudinary.uploader.destroy(user.avatar.public_id);
        }
  
        user.avatar = {
          public_id: req.file.filename,
          url: req.file.path,
        };
        const updatedUser = await user.save();
        res.json(updatedUser.avatar);
      } else {
        res.status(400);
        throw new Error('Please upload an image file.');
      }
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  });