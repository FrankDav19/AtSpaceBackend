"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class Token {
    constructor() { }
    static getJsonWebToken(payload) {
        return jsonwebtoken_1.default.sign({ usuario: payload }, this.seed, { expiresIn: this.expiration });
    }
    static verifyToken(userToken) {
        return new Promise((resolve, reject) => {
            jsonwebtoken_1.default.verify(userToken, this.seed, (err, decoded) => {
                if (err) {
                    reject();
                }
                else {
                    resolve(decoded);
                }
            });
        });
    }
}
exports.default = Token;
Token.seed = 'Esta_es_la_semilla_de_mi_app';
Token.expiration = '30d';
