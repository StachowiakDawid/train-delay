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
    const ltree = `*.${department}.*.${destination}.*`;
    const departmentId = (await prisma.$queryRaw`SELECT id FROM station where name = ${department}` as any)[0]?.id as number;
    const destinationId = (await prisma.$queryRaw`SELECT id FROM station where name = ${destination}` as any)[0]?.id as number;
    const data = await prisma.$queryRawTyped(getSimple(ltree, departmentId, destinationId));

    res.json(data);
});

const server = app.listen(3000);