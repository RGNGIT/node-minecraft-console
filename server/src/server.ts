import consts from './const/var';
import {buildRoutes} from './router/index';
import path from 'path';
import express from 'express';
import cors from 'cors';

const corsOpt = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200
};

class Server {
    async defineMiddlewares(app) {
        app.use(express.static(path.join(__dirname, '../../front')));
        app.use(cors(corsOpt));
    }
    async defineConsts() {
        consts.root = __dirname;
    }
    async main(app) {
        await this.defineMiddlewares(app);
        await this.defineConsts();
        await buildRoutes(app);
    }
}

export default new Server();