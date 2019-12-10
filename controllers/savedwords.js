const express = require("express");
const router = express.Router();
const SavedWords = require("../models/savedwords.js");

module.exports = router;

router.post(`/`, (req, res) => {
    SavedWords.create(req.body, (err, createdWord) => {
        res.json(createdWord);
    });
});

router.get(`/`, (req, res) => {
    SavedWords.find({}, (err, foundWord) => {
        res.json(foundWord);
    });
});

router.delete(`/:id`, (req, res) => {
    SavedWords.findByIdAndRemove(req.params.id, (err, deletedWord) => {
        res.json(deletedWord);
    });
});

router.put(`/:id`, (req, res) => {
    SavedWords.findByIdAndUpdate(
        req.params.id,
        req.body, {
            new: true
        },
        (err, updatedWord) => {
            res.json(updatedWord);
        }
    );
});