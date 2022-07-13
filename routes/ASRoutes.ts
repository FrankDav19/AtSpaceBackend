import { Router, Request, Response } from "express";
import { User, Station, Reading } from "../models/models";
import bcrypt from 'bcrypt';
import Token from "../classes/token";

// Router instance
const ASRoutes = Router();

// Test service
ASRoutes.post('/test', (req: Request, res: Response) => {
    res.json({
        ok: true,
        mensaje: 'Todo funciona correctamente'
    });
});

// Create user
ASRoutes.post('/create/user', (req: Request, res: Response) => {
    const user = {
        userData: {
            name: req.body.name,
            image: req.body.image,
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
            email: req.body.email,
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

export default ASRoutes;