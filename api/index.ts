import express from 'express';
import { PrismaClient } from './generated/prisma';
import { getSimple } from './generated/prisma/sql';
const prisma = new PrismaClient();
const app = express();
import 'dotenv/config';
import process  from 'node:process';

BigInt.prototype.toJSON = function() {
    return this.toString()
} 

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(express.json());

app.get('/api/:department/:destination', async (req, res) => {
    const { department, destination } = req.params;
    const data = await prisma.$queryRawTyped(getSimple(department, destination));

    res.json(data);
});

const server = app.listen(3000);