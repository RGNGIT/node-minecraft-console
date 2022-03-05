import {Request, Response} from 'express';
import Srv from '../services/srv';
import consts from '../const/var';

class Operator {
    async getServerDirs(req : Request, res : Response): Promise < void > {
        try {
            res.json({Directories: await Srv.fetchServerDirs()});
        } catch (err) {
            res.json(err);
        }
    }
    async setServer(req : Request, res : Response): Promise < void > { // Установка сервера для операций
        try {
            if ((await Srv.fetchServerDirs()).includes(req.body.Name)) {
                consts.selectedServer = req.body.Name;
            } else {
                throw new Error("No such server in directory!");
            }
        } catch (err) {
            res.json(err);
        }
    }
}

export default new Operator();
