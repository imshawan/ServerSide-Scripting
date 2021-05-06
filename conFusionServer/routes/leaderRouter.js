const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const Leaders = require('../models/leaders');
var authenticate = require('../authenticate');
const cors = require('./cors');
const leaderRouter = express.Router();

leaderRouter.use(bodyparser.json());
leaderRouter.route('/(:leaderID)?')
//leaderRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
	if(req.params.leaderID){
		Leaders.findById(req.params.leaderID)
		.then((leader) => {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json(leader)
		}, (err) => next(err))
		.catch((err) => next(err));
	}
    else {
	Leaders.find(req.query)
	.then((leaders) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(leaders);
	}, (err) => next(err))
	.catch((err) => next(err));
    }
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
	if(req.params.leaderID){
		res.statusCode = 403;
		res.end('POST operation not supported on /leaders/' + req.params.leaderID);
	}
    else {
	Leaders.create(req.body)
	.then((leader) => {
		console.log('Leader Created', leader);
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(leader);
	}, (err) => next(err))
	.catch((err) => next(err));
    }
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
	if(req.params.leaderID){
		Leaders.findByIdAndUpdate(req.params.leaderID, {
			$set: req.body
		}, { new: true })
		.then((leader) => {
			console.log('leader Updated', leader);
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json(leader);
		}, (err) => next(err))
		.catch((err) => next(err));
	}
    else {
	res.statusCode = 403;
	res.end('PUT operation bot supported on leaders');
    }
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
	if(req.params.leaderID){
		Leaders.findByIdAndRemove(req.params.leaderID)
		.then((resp) => {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json(resp);
		}, (err) => next(err))
		.catch((err) => next(err));
	}
    else {
	Leaders.remove({})
	.then((resp) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(resp);
	}, (err) => next(err))
	.catch((err) => next(err));
    }
});

module.exports = leaderRouter;