import { Router, Request, Response } from "express";
import { User, Station, Reading, IReading } from "../models/models";
import bcrypt from 'bcrypt';
import Token from "../classes/token";
import { checkToken } from '../middlewares/auth';

// Router instance
const ASRoutes = Router();

// Test route
ASRoutes.post('/test', (req: Request, res: Response) => {
    res.json({
        ok: true,
        mensaje: 'Todo funciona correctamente'
    });
});

// Methods used to create data in database.
// Create user
ASRoutes.post('/create/user', (req: Request, res: Response) => {
    const user = {
        userData: {
            name: req.body.name,
            image: req.body.image,
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10)
        },
        uiType: req.body.uiType,
        stations: []
    }

    User.create(user).then(userDB => {
        const usuarioToken = Token.getJsonWebToken({
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
ASRoutes.post('/create/station', checkToken, (req: any, res: Response) => {
    const station = {
        name: req.body.name,
        location: {
            type: 'Point',
            coordinates: [req.body.lat, req.body.long]
        },
        units: req.body.units || '0',
        readings: []
    }

    Station.create(station).then(stationDB => {
        User.findByIdAndUpdate(req.user._id, {$push: { stations: stationDB._id }}, { new: true, useFindAndModify: false }, (err) => {
            if (err) throw err;
        });

        res.json({
            stationID: stationDB._id,
            owner: req.user._id
        });
    });
});

// Add readings
ASRoutes.post('/create/reading', (req: Request, res: Response) => {
    const reading : IReading= {
       humidity: req.body.humidity,
       hic: req.body.hic,
       pm1: req.body.pm1,
       pm10: req.body.pm10,
       pm25: req.body.pm25,
       rainMM: req.body.rainMM,
       temp: req.body.temp,
       wDirection: req.body.wDirection,
       wSpeed: req.body.wSpeed
    }

    const stationId = req.get('stationId') || '';

    Reading.create(reading).then(readingDB => {
        Station.findByIdAndUpdate(stationId, {$push: { readings : readingDB._id }}, { new: true, useFindAndModify: false }, (err) => {
            if (err) throw err;
        });

        res.json({
            readingID: readingDB._id,
            station: stationId
        });
    });
});


//Methods used to retrieve information from the database.
// User Login
ASRoutes.post('/login', (req: Request, res: Response) => {
    User.findOne({ email: req.body.email }, (err: any, userDB: any) => {
        if (err) throw err;

        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'Usuario inexistente',
            });
        };

        if (bcrypt.compareSync(req.body.password, userDB.userData.password)) {
            const usuarioToken = Token.getJsonWebToken({
                _id: userDB._id,
                name: userDB.userData.name,
                username: userDB.userData.username,
                image: userDB.userData.image,
                email: req.body.email
            });

            res.json({
                ok: true,
                token: usuarioToken
            });
        } else {
            return res.json({
                ok: false,
                mensaje: 'Usuario y/o constraseña incorrectos'
            });
        }
    });
});

export default ASRoutes;