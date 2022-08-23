module.exports = {
    set: (req, res, next) => {
        let formatoRequisitado = req.header('Accept');
        if (formatoRequisitado === '*/*') formatoRequisitado = 'application/json';
        if (formatoRequisitado !== 'application/json') return res.status(406).end();
        res.setHeader('Content-Type', 'application/json');
        next();   
    }
}