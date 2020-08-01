const express = require('express');
const router = express.Router();
const Journal = require('../models/journal');
const auth = require('../middleware/auth');
const pagination = require('../middleware/pagination');

router.post('/journal/save', auth, async (req, res) => {
    let journal = await Journal.findOneAndUpdate(
        {
            userId: req.user._id,
            title: req.body.title,
        },
        {
            html: req.body.html,
        }
    );

    if (!journal) {
        let journal = new Journal({
            userId: req.user._id,
            title: req.body.title,
            html: req.body.html,
        });

        journal = await journal.save();
        return res.status(200).send(journal);
    }

    return res.status(200).send(journal);
});

router.get(
    '/entries/all/:page',
    auth,
    (req, res, next) => {
        req.customQuery = { userId: req.user._id };
        next();
    },
    pagination
);

router.get(
    '/entries/favorites/:page',
    auth,
    (req, res, next) => {
        req.customQuery = { userId: req.user._id, isFavorite: true };
        next();
    },
    pagination
);

router.get(
    '/search/:text',
    auth,
    (req, res, next) => {
        req.customQuery = {
            html: {
                $regex: req.params.text,
                $options: 'i' //case insensitive
            },
        };
        next();
    },
    pagination
);

router.post('/journal/delete', auth, async (req, res) => {
    await Journal.findByIdAndDelete(req.body.id);
    res.end();
});

router.post('/journal/favorite', auth, async (req, res) => {
    let journal = await Journal.findById(req.body.id);

    await Journal.findByIdAndUpdate(req.body.id, {
        isFavorite: !journal.isFavorite,
    });

    res.end();
});

router.post('/journal/edit', auth, async (req, res) => {
    let journal = await Journal.findByIdAndUpdate(req.body.id, {
        html: req.body.html,
    });
    res.status(200).send(journal);
});

router.post(['/journal/more', '/journal/less'], auth, async (req, res) => {
    let journal = await Journal.findById(req.body.id);
    res.status(200).send(journal);
});

module.exports = router;
