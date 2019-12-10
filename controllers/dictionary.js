// https://www.npmjs.com/package/unofficial-jisho-api
const express = require('express');
const router = express.Router();

module.exports = router;
const jishoApi = require('unofficial-jisho-api');
const jisho = new jishoApi();

// router.post(`/`, (req, res) => {
//     Japanese.create(req.body, (err, createdJapanese) => {
//         res.json(createdJapanese);
//     })
// })

router.get(`/:word`, (req, res) => {
    console.log("FINDING WORD")
    jisho.searchForPhrase(req.params.word).then(result => {
        res.json(result.data)
    }).catch(() => {
        console.log("ERROR")
    });
})

// router.delete(`/:id`, (req, res) => {
//     Japanese.findByIdAndRemove(req.params.id, (err, deletedJapanese) => {
//         res.json(deletedJapanese);
//     })
// })

// router.put(`/:id`, (req, res) => {
//     Japaneses.findByIdAndUpdate(req.params.id, req.body, {
//         new: true
//     }, (err, updatedJapanese) => {
//         res.json(updatedJapanese);
//     })
// })