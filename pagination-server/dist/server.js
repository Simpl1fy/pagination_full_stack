"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const db_1 = __importDefault(require("./database/db"));
const dataSchema_1 = __importDefault(require("./database/Model/dataSchema"));
const app = (0, express_1.default)();
// middleware
app.use(bodyParser.json());
app.use(cors());
const PORT = process.env.PORT || 5000;
(0, db_1.default)().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running at port ${PORT}`);
    });
});
app.get('/', (_req, res) => {
    res.send("Express server with typescript");
});
app.post('/add', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    console.log(data);
    try {
        const insertedData = yield dataSchema_1.default.insertMany(data);
        console.log(insertedData);
        res.status(201).json({
            message: "Data inserted successfully",
            data: insertedData
        });
    }
    catch (err) {
        console.log("An error occured while inserting data =", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
app.get('/data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, limit } = req.query;
        const pageNumber = Number(page) || 1;
        const limitNumber = Number(limit) || 5;
        const skipData = (pageNumber - 1) * limitNumber;
        const resData = yield dataSchema_1.default.find().skip(skipData).limit(limitNumber);
        // console.log(resData);
        const cRes = yield dataSchema_1.default.find();
        const totalDocs = cRes.length;
        res.status(200).json({
            data: resData,
            nbHits: totalDocs
        });
    }
    catch (err) {
        console.log("An error occured while fetching paginated data =", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
