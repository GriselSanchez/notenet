const Journal = require('../models/journal');


module.exports = async (req, res) => {
    const query = { ...req.customQuery }
    const limit = 10;
    const page = req.params.page || 1;

    const numOfProducts = await Journal.countDocuments(query);

    const foundProducts = await Journal.find(query)
        .skip(limit * page - limit)
        .limit(limit)
        .sort([['updated_at', -1]]);

    try {
        const paginationData = { numOfProducts, foundProducts, resPerPage: limit };
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(paginationData);
    } catch (err) {
        retun.status(400).send(err);
    }
};