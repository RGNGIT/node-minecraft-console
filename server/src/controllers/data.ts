import {Request, Response} from 'express';
import Srv from '../services/srv';
import consts from '../const/var';
import StaticData from '../services/static';

class ServerData {
    async getCurrentNMCConfig(req : Request, res : Response): Promise < void > {
        try {
            res.json(consts);
        } catch (err) {
            res.json(err);
        }
    }
    async getAvailableServersList(req : Request, res : Response): Promise < void > {
        try {
            let array = [];
            for (let server of await Srv.fetchServerDirs()) {
                array.push({Name: server, Meta: await Srv.fetchServerMeta(server)});
            }
            res.json(array);
        } catch (err) {
            res.json(err);
        }
    }
    async getServerIcon(req : Request, res : Response): Promise < void > {
        try {
            res.set('Content-Type', 'image/png');
            res.send(await StaticData.getServerIcon(req.params.name));
        } catch (err) {
            res.json(err);
        }
    }
}

export default new ServerData();
