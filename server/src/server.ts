import singleton from './const/var';
import {buildRoutes} from './router/index';
import path from 'path';
import express from 'express';
import cors from 'cors';
import FileUpload from 'express-fileupload';

const corsOpt = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200
};

class Server {
    async defineMiddlewares(app) {
        app.use(express.static(path.join(__dirname, process.env.DEV === 'true' ? '../../dev-front' : '../../front')));
        app.use(cors(corsOpt));
        app.use(FileUpload());
    }
    async defineConsts() {
        singleton.root = __dirname;
    }
    async main(app) {
        await this.defineMiddlewares(app);
        await this.defineConsts();
        await buildRoutes(app);
    }
}

export default new Server();