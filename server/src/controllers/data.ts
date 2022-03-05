import {Request, Response} from 'express';
import consts from '../const/var';

class ServerData {
    async getCurrentNMCConfig(req : Request, res : Response): Promise < void > {
        try {
            res.json(consts);
        } catch(err) {
            res.json(err);
        }
    }
}

export default new ServerData();