const express = require('express');
const bodyParser = require('body-parser');
const Favorites = require('../models/favourites');
const authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user: req.user._id})
    .populate('user')
    .populate('dishes')
    .then((favorites) => {
        if (!favorites) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({"exists": false, "favorites": favorites});
        }
        else {
            if (favorites.dishes.indexOf(req.params.dishId) < 0) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": false, "favorites": favorites});
            }
            else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": true, "favorites": favorites});
            }
        }

    }, (err) => next(err))
    .catch((err) => next(err))
})

.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
            .then((favorite) => {
                if (favorite == null) {
                    Favorites.create()
                        .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            for (let i in req.body) {
                                favorite.dishes.push(req.body[i]);
                            }
                            favorite.save()
                            .populate('user')
                            .populate('dishes')
                            res.json(favorite);
                        }, (err) => next(err));
                } else {
                    for (let i in req.body) {
                        Favorites.findOne({user: newFavorite.user})
                            .then((oldFavorite) => {
                                if (oldFavorite == null) {
                                    favorite.dishes.push(req.body[i]);
                                }
                            });
                    }
                    favorite.save()
                    .populate('user')
                    .populate('dishes')
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json')
                    res.json(favorite);
                }
            })
            .catch((err) => next(err));
    })

.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /favorites");
})

.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOneAndRemove({user: req.user._id})
    .then(resp => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, err => next(err))
    .catch(err => next(err));  
});


favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorites) => {
        if (!favorites) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({"exists": false, "favorites": favorites});
        }
        else {
            if (favorites.dishes.indexOf(req.params.dishId) < 0) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": false, "favorites": favorites});
            }
            else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": true, "favorites": favorites});
            }
        }

    }, (err) => next(err))
    .catch((err) => next(err))
})

.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findById(req.body._id)
            .then((favorite) => {
                if (favorite == null) {
                    let newFavorite = {};
                    newFavorite.user = req.user._id;
                    Favorites.create(newFavorite)
                        .then((favorite) => {
                            console.log('Favorite Created ', newFavorite);
                            favorite.dishes.push(req.params.dishId)
                            favorite.save()
                            .populate('user')
                            .populate('dishes')
                                .then((favorite) => {
                                    Dishes.findById(favorite._id)
                                        .then((favorite) => {
                                            res.statusCode = 200;
                                            res.setHeader('Content-Type', 'application/json');
                                            res.json(favorite);
                                        })
                                }, (err) => next(err));
                        }, (err) => next(err))
                        .catch((err) => next(err));
                } else {
                    err = new Error('Dish ' + req.params.dishId + ' already exist');
                    err.status = 404;
                    return next(err);
                }
            })
    })

.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites/'+ req.params.dishId);
})

.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        favorite.dishes.remove(req.params.favoriteId);
        favorite.save()
        .populate('user')
        .populate('dishes')
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => next(err));
    })
    .catch((err) => next(err));
});


favoriteRouter.route('/checkJWTtoken')
.get(cors.corsWithOptions, (req, res) => {
    passport.authenticate('jwt', {session: false}, (err, user, info) => {
      if (err)
        return next(err);
      
      if (!user) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        return res.json({status: 'JWT invalid!', success: false, err: info});
      }
      else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        return res.json({status: 'JWT valid!', success: true, user: user});
  
      }
    }) (req, res);
  });

module.exports = favoriteRouter;