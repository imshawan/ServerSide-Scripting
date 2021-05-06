const express = require('express');
const bodyparser = require('body-parser');

const leaderRouter = express.Router();

leaderRouter.use(bodyparser.json());
leaderRouter.route('/(:leaderID)?')

.all((req, res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/html');
    next();
})

.get((req, res, next) => {
    if(req.params.leaderID) {
        res.end('Will send details of the leader: ' + req.params.leaderID + ' to you!');
    }
    else {
        res.end('Will send all the leaders to you!');
    }
})

.post((req, res, next) => {
    if(req.params.leaderID){
        res.statusCode = 403;
        res.end('POST operation not supported on /leaders/' + 
            req.params.leaderID);
    }
    else {
    res.end('Will add the leaders: ' + req.body.name + 
        ' with details: ' + req.body.description);
    }
})

.put((req, res, next) => {
    if(req.params.leaderID) {
        res.write('Updating the leaders: ' + req.params.leaderID + '\n')
        res.end('Will update the leaders: ' + req.body.name + 
            ' with details: ' + req.body.description);
    }
    else {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders');
    }
})

.delete((req, res, next) => {
    if(req.params.leaderID) {
        res.end('Deleting leader: ' + req.params.leaderID);
    }
    else {
    res.end('Deleting all leaders!');
    }
});

module.exports = leaderRouter;