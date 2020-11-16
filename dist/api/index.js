"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KataPredict = void 0;
var axios_1 = __importDefault(require("axios"));
var ts_dotenv_1 = require("ts-dotenv");
var env = ts_dotenv_1.load({
    TELEGRAF: String,
    KATA_TOKEN: String,
    KATA_NL_ID: String
});
var configAxios = {
    baseURL: "https://geist.kata.ai/nlus/" + env.KATA_NL_ID,
    headers: {
        Authorization: "Bearer " + env.KATA_TOKEN
    }
};
var axios = axios_1.default.create(configAxios);
exports.KataPredict = function (text) {
    return axios.post('/predict', { text: text });
};
//# sourceMappingURL=index.js.map