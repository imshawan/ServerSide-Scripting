const express = require('express');
const bodyparser = require('body-parser');
const Promotions = require('../models/promotions');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');
const cors = require('./cors');

const promoRouter = express.Router();

promoRouter.use(bodyparser.json());
promoRouter.route('/(:promoID)?')
//promoRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    if(req.params.promoID) {
        Promotions.findById(req.params.promoID)
        .then((promotion) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promotion);
        }, (err) => next(err))
        .catch((err) => next(err));
    }
    else {
    Promotions.find(req.query)
    .then((promotions) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);
    }, (err) => next(err))
    .catch((err) => next(err));
    }
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    if (req.params.promoID){
        res.statusCode = 403;
        res.end('POST operation not supported on /promotions/'+ req.params.promoID);
    }
    else {
    Promotions.create(req.body)
    .then((promotion) => {
        console.log('Promotion Created ', promotion);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    }, (err) => next(err))
    .catch((err) => next(err));
    }
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    if(req.params.promoID){
        Promotions.findByIdAndUpdate(req.params.promoID, {
            $set: req.body
        }, { new: true })
        .then((promotion) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promotion);
        }, (err) => next(err))
        .catch((err) => next(err));
    }
    else {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
    }
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    if(req.params.promoID) {
        Promotions.findByIdAndRemove(req.params.promoID)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
    }
    else {
    Promotions.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));  
    }  
});


module.exports = promoRouter;