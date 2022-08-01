"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const models_1 = require("../models/models");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = __importDefault(require("../classes/token"));
const auth_1 = require("../middlewares/auth");
const mongoose_1 = require("mongoose");
// Router instance
const ASRoutes = (0, express_1.Router)();
// Test route
ASRoutes.post('/test', (req, res) => {
    res.json({
        ok: true,
        mensaje: 'Todo funciona correctamente'
    });
});
// Methods used to create data in database.
// Create user
ASRoutes.post('/create/user', (req, res) => {
    const user = {
        userData: {
            name: req.body.name,
            image: req.body.image,
            username: req.body.username,
            email: req.body.email,
            password: bcrypt_1.default.hashSync(req.body.password, 10)
        },
        uiType: req.body.uiType,
        stations: []
    };
    models_1.User.create(user).then(userDB => {
        const usuarioToken = token_1.default.getJsonWebToken({
            _id: userDB._id,
            name: req.body.name,
            image: req.body.image,
            username: req.body.username,
            email: req.body.email
        });
        res.json({
            ok: true,
            token: usuarioToken
        });
    }).catch(err => {
        res.status(400).json({
            ok: false,
            err
        });
    });
});
// Add station
ASRoutes.post('/create/station', auth_1.checkToken, (req, res) => {
    const station = {
        name: req.body.name,
        location: {
            type: 'Point',
            coordinates: [req.body.lat, req.body.long]
        },
        units: req.body.units || '0',
        readings: []
    };
    models_1.Station.create(station).then(stationDB => {
        models_1.User.findByIdAndUpdate(req.user._id, { $push: { stations: stationDB._id } }, { new: true, useFindAndModify: false }, (err) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }
            ;
        });
        res.json({
            stationID: stationDB._id,
            owner: req.user._id
        });
    });
});
// Add readings
ASRoutes.put('/add-reading', (req, res) => {
    const reading = {
        humidity: req.body.humidity,
        hic: req.body.hic,
        pm1: req.body.pm1,
        pm10: req.body.pm10,
        pm25: req.body.pm25,
        rainMM: req.body.rainMM,
        temp: req.body.temp,
        wDirection: req.body.wDirection,
        wSpeed: req.body.wSpeed
    };
    const stationId = req.get('stationId');
    if (!stationId) {
        return res.status(400).json({
            ok: false,
            err: "Station ID Missing"
        });
    }
    models_1.Station.findByIdAndUpdate(stationId, { $push: { readings: reading } }, { new: true, useFindAndModify: false }, (err) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        ;
    });
    res.json({
        ok: true,
        station: stationId
    });
});
// Add favorites
ASRoutes.put('/add-favorite', auth_1.checkToken, (req, res) => {
    if (!req.body.stationId) {
        return res.status(400).json({
            ok: false,
            err: "Station ID Missing"
        });
    }
    var stationId = new mongoose_1.Types.ObjectId(req.body.stationId);
    models_1.User.findByIdAndUpdate(req.user._id, { $push: { favorites: stationId } }, { new: true, upsert: true }, (err, success) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        else {
            res.status(200).json({
                ok: true,
                success: success
            });
        }
    });
});
//Methods used to retrieve information from the database.
// User Login
ASRoutes.post('/login', (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({
            ok: false,
            err: 'Insert email or password'
        });
    }
    models_1.User.findOne({ email: req.body.email }, (err, userDB) => {
        if (!userDB) {
            return res.status(400).json({
                ok: false,
                err: 'User not found'
            });
        }
        ;
        if (bcrypt_1.default.compareSync(req.body.password, userDB.userData.password)) {
            const usuarioToken = {
                _id: userDB._id,
                name: userDB.userData.name,
                username: userDB.userData.username,
                image: userDB.userData.image,
                email: req.body.email
            };
            res.status(200).json({
                ok: true,
                token: usuarioToken
            });
        }
        else {
            return res.status(400).json({
                ok: false,
                err: 'Wrong email or password'
            });
        }
    });
});
// Get all the stations
ASRoutes.get('/stations/all', (req, res) => {
    models_1.Station.find({}).select('readings').slice('readings', -1)
        .then((stations) => {
        res.status(200).json({
            ok: true,
            stations: stations
        });
    });
});
ASRoutes.get('/stations/:id', (req, res) => {
    models_1.Station.findOne({ _id: req.params.id }).select('readings').slice('readings', -1)
        .then((station) => {
        res.status(200).json({
            ok: true,
            station: station
        });
    }).catch(err => {
        if (err.name == 'CastError') {
            res.status(400).json({
                ok: false,
                error: 'Invalid Station ID'
            });
        }
        else {
            res.status(400).json({
                ok: false,
                error: err
            });
        }
    });
});
exports.default = ASRoutes;
