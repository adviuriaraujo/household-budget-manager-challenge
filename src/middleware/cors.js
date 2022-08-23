module.exports = {
    origin: (req, res, next) => {
        res.set('Access-Control-Allow-Origin', '*');
        next();
    }
};
