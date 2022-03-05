import express from "express";
import asyncHandler from "express-async-handler";
import { protect, admin } from "../Middleware/AuthMiddleware.js";
import Post from "../Models/Post.js";

const postRouter = express.Router();

// CREATE POST
postRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const newPost = new Post(req.body);

    try {
      const savedPost = await newPost.save();
      res.status(200).json(savedPost);
    } catch (error) {
      res.status(500).json(error);
    }
  })
);

// UPDATE POST
postRouter.put(
  "/:id",
  asyncHandler(async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (post.username === req.body.username) {
        try {
          const updatePost = await Post.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
          );
          res.status(200).json(updatePost);
        } catch (error) {
          res.status(500).json(error);
        }
      } else {
        res.status(401).json("You can update only your post!");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  })
);

// DELETE POST
postRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (post.username === req.body.username) {
        try {
          await post.delete();
          res.status(200).json("Post has been deleted....");
        } catch (error) {
          res.status(500).json(error);
        }
      } else {
        res.status(401).json("You can delete only your post!");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  })
);

// GET POST
postRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      res.status(200).json(post);
    } catch (error) {
      res.status(500).json(error);
    }
  })
);
// GET ALL POST
postRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const username = req.query.user;
    try {
      let posts;
      if (username) {
        posts = await Post.find({ username });
      } else {
        posts = await Post.find();
      }
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json(error);
    }
  })
);

export default postRouter;
