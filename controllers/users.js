const express = require("express");
const router = express.Router();
const Users = require("../models/users.js");

module.exports = router;

router.post(`/`, (req, res) => {
  Users.create(req.body, (err, createdUser) => {
    if (err) {
      console.log(err);
    }
    console.log("WORKING FINE");
    res.json(createdUser);
  });
});

router.get(`/`, (req, res) => {
  Users.find({}, (err, foundUser) => {
    if (err) {
      console.log(err);
    }
    console.log("WORKING FINE");
    res.json(foundUser);
  });
});

router.delete(`/:id`, (req, res) => {
  Users.findByIdAndRemove(req.params.id, (err, deletedUser) => {
    res.json(deletedUser);
  });
});

router.put(`/:id`, (req, res) => {
  Users.findByIdAndUpdate(
    req.params.id,
    req.body, {
      new: true
    },
    (err, updatedUser) => {
      res.json(updatedUser);
    }
  );
});