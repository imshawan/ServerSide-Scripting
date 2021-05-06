const express = require('express');
const bodyparser = require('body-parser');

const dishRouter = express.Router();

dishRouter.use(bodyparser.json());
dishRouter.route('/(:dishID)?')

.all((req, res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/html');
    next();
})

.get((req, res, next) => {
    if(req.params.dishID) {
        res.end('Will send details of the dish: ' + req.params.dishID + ' to you!');
    }
    else res.end('Will send all the dishes to you!');
})

.post((req, res, next) => {
    if(req.params.dishID){
        res.statusCode = 403;
        res.end('POST operation not supported on /dishes/' + 
            req.params.dishID);
    }
    else {
    res.end('Will add the dish: ' + req.body.name + 
        ' with details: ' + req.body.description);
    }
})

.put((req, res, next) => {
    if(req.params.dishID) {
        res.write('Updating the dish: ' + req.params.dishID + '\n')
        res.end('Will update the dish: ' + req.body.name + 
            ' with details: ' + req.body.description);
    }
    else {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
    }
})

.delete((req, res, next) => {
    if(req.params.dishID) {
        res.end('Deleting dish: ' + req.params.dishID);
    }
    else {
    res.end('Deleting all dishes!');
    }
});

module.exports = dishRouter;