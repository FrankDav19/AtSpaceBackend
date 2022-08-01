"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkToken = void 0;
const token_1 = __importDefault(require("../classes/token"));
const checkToken = (req, res, next) => {
    const userToken = req.get('userToken') || '';
    token_1.default.verifyToken(userToken)
        .then((decoded) => {
        console.log('Decoded', decoded);
        req.user = decoded.usuario;
        next();
    })
        .catch(err => {
        res.json({
            ok: false,
            message: `Incorrect Token: ${err} `
        });
    });
};
exports.checkToken = checkToken;
