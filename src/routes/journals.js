const express = require('express');
const router = express.Router();
const Journal = require('../models/journal');
const auth = require('../middleware/auth');

router.post("/journal/save", auth, async (req, res) => {
    let journal = await Journal.findOneAndUpdate({
        userId: req.user._id,
        title: req.body.title,
    }, {
        html: req.body.html
    });

    if (!journal) {
        let journal = new Journal({
            userId: req.user._id,
            title: req.body.title,
            html: req.body.html
        });

        journal = await journal.save();
        return res.status(200).send(journal);
    }

    return res.status(200).send(journal);
});

router.get("/entries/all/:page", auth, async (req, res) => {
    const resPerPage = 10;
    const page = req.params.page || 1;

    const numOfProducts = await Journal.countDocuments({
        userId: req.user._id
    });

    const foundProducts = await Journal.find({
        userId: req.user._id
    }).skip((resPerPage * page) - resPerPage).limit(resPerPage).sort([
        ["updated_at", -1]
    ]);

    /*     const allTitles = await Journal.find({
            userId: req.user._id
        }, {
            title: 1
        }); */

    const data = {
        numOfProducts: numOfProducts,
        foundProducts: foundProducts,
        resPerPage: resPerPage
    }

    res.setHeader("Content-Type", "application/json");
    res.status(200).send(data);
});

router.get("/entries/favorites/:page", auth, async (req, res) => {
    const resPerPage = 10;
    const page = req.params.page || 1;

    const numOfProducts = await Journal.countDocuments({
        userId: req.user._id,
        isFavorite: true
    });

    const foundProducts = await Journal.find({
        userId: req.user._id,
        isFavorite: true
    }).skip((resPerPage * page) - resPerPage).limit(resPerPage).sort([
        ["updated_at", -1]
    ]);

    const data = {
        numOfProducts: numOfProducts,
        foundProducts: foundProducts,
        resPerPage: resPerPage,
    }

    res.setHeader("Content-Type", "application/json");
    res.status(200).send(data);
});

router.post("/journal/delete", auth, async (req, res) => {
    await Journal.findByIdAndDelete(req.body.id);
    res.end();
});

router.post("/journal/favorite", auth, async (req, res) => {
    let journal = await Journal.findById(req.body.id);
    await Journal.findByIdAndUpdate(req.body.id, {
        isFavorite: !journal.isFavorite //setear al contrario de lo que está para asi sacar el fav si quiero
    });
    res.end();
});

router.post("/journal/edit", auth, async (req, res) => {
    let journal = await Journal.findByIdAndUpdate(req.body.id, {
        html: req.body.html
    });
    res.status(200).send(journal);
});

router.post("/journal/more", auth, async (req, res) => {
    let journal = await Journal.findById(req.body.id);
    res.status(200).send(journal);
});

router.post("/journal/less", auth, async (req, res) => {
    let journal = await Journal.findById(req.body.id);
    res.status(200).send(journal);
});

router.post("/titles/all", auth, async (req, res) => {
    let journal = await Journal.findById(req.body.id);
    res.status(200).send(journal);
});

router.get("/search/:text", async (req, res) => {
    const resPerPage = 5;
    const page = req.params.page || 1;

    const numOfProducts = await Journal.countDocuments({
        html: {
            $regex: req.params.text,
            $options: "i" //case insensitive
        }
    });

    const foundProducts = await Journal.find({
        html: {
            $regex: req.params.text,
            $options: "i" //case insensitive
        }
    }).skip((resPerPage * page) - resPerPage).limit(resPerPage).sort([
        ["updated_at", -1]
    ]);

    const data = {
        numOfProducts: numOfProducts,
        foundProducts: foundProducts,
        resPerPage: resPerPage,
    }
    res.send(data);
});

module.exports = router;