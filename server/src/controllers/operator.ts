import {Request, Response} from 'express';
import Srv from '../services/srv';
import singleton from '../const/var';
import java from '../services/java';

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
            if ((await Srv.fetchServerDirs()).includes(req.query.Name as string)) {
                singleton.selectedServer = req.query.Name as string;
                res.send("OK");
            } else {
                res.send("Probably, server directory was not found!");
            }
        } catch (err) {
            res.json(err);
        }
    }
    async startServer(req : Request, res : Response): Promise < void > {
        try {
            res.json(await java.startProc());
        } catch(err) {
            res.json(err);
        }
    }
    async submitCommand(req : Request, res : Response): Promise < void > {
        try {
            res.json(await Srv.sendCommand(req.params.cmd));
        } catch(err) {
            res.json(err);
        }
    }
}

export default new Operator();
