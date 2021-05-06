const express = require('express');
const bodyparser = require('body-parser');

const promoRouter = express.Router();

promoRouter.use(bodyparser.json());
promoRouter.route('/(:promoID)?')

.all((req, res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/html');
    next();
})

.get((req, res, next) => {
    if(req.params.promoID) {
        res.end('Will send details of the Promotion: ' + req.params.promoID + ' to you!');
    }
    else {
        res.end('Will send all the Promotions to you!');
    }
})

.post((req, res, next) => {
    if(req.params.promoID){
        res.statusCode = 403;
        res.end('POST operation not supported on /promotions/' + 
            req.params.promoID);
    }
    else {
    res.end('Will add the promotion: ' + req.body.name + 
        ' with details: ' + req.body.description);
    }
})

.put((req, res, next) => {
    if(req.params.promoID) {
        res.write('Updating the promotion: ' + req.params.promoID + '\n')
        res.end('Will update the promotion: ' + req.body.name + 
            ' with details: ' + req.body.description);
    }
    else {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
    }
})

.delete((req, res, next) => {
    if(req.params.promoID) {
        res.end('Deleting promotion: ' + req.params.promoID);
    }
    else {
    res.end('Deleting all promotions!');
    }
});

module.exports = promoRouter;