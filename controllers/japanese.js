const express = require('express');
const router = express.Router();
const Japanese = require('../models/japanese.js');

module.exports = router;


router.post(`/`, (req, res) => {
    Japanese.create(req.body, (err, createdJapanese) => {
        res.json(createdJapanese);
    })
})

router.get(`/`, (req, res) => {
    Japanese.find({}, (err, foundJapanese) => {
        res.json(foundJapanese);
    })
})

router.delete(`/:id`, (req, res) => {
    Japanese.findByIdAndRemove(req.params.id, (err, deletedJapanese) => {
        res.json(deletedJapanese);
    })
})

router.put(`/:id`, (req, res) => {
    Japaneses.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    }, (err, updatedJapanese) => {
        res.json(updatedJapanese);
    })
})