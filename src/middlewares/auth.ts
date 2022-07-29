import { Request, Response, NextFunction } from "express";
import Token from "../classes/token";

export const checkToken = (req: any, res: Response, next: NextFunction) => {
    
    const userToken = req.get('userToken') || '';

    Token.verifyToken(userToken)
        .then((decoded: any) => {
            console.log('Decoded', decoded);
            req.user = decoded.usuario;
            next();
        })
        .catch(err => {
            res.json({
                ok: false,
                message: `Incorrect Token: ${err} `
            })
        });
}