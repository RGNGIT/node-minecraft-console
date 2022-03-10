import {Request, Response} from 'express';
import Srv from '../services/srv';
import singleton from '../const/var';
import StaticData from '../services/static';
import {status} from 'minecraft-server-util';

const mc_options = {
    timeout: 1000 * 5,
    enableSRV: true
}

class ServerData {
    async getCurrentNMCConfig(req : Request, res : Response): Promise < void > {
        try {
            res.json(singleton);
        } catch (err) {
            res.json(err);
        }
    }
    async getAvailableServersList(req : Request, res : Response): Promise < void > {
        try {
            let array = [];
            for (let server of await Srv.fetchServerDirs()) {
                array.push({Name: server, Meta: await Srv.fetchServerMeta(server), Mods: await Srv.fetchModifications(server)});
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
    async getActiveServerData(req : Request, res : Response): Promise < void > {
        try {
            res.json(await status(process.env.ADDR, 25565, mc_options));
        } catch (err) {
            res.json(err);
        }
    }
    async getServerLog(req : Request, res : Response): Promise < void > {
        try {
            res.json({Log: singleton.log});
        } catch (err) {
            res.json(err);
        }
    }
    async uploadServer(req, res : Response): Promise < void > {
        try {
            await StaticData.writeServer(req.files.server, req.params.name, req.query.ver, req.files.icon, req.query.eula);
            res.json('OK');
        } catch (err) {
            res.json(err);
        }
    }
    async deleteServer(req : Request, res : Response): Promise < void > {
        try {
            res.json(await StaticData.deleteServer(req.params.name));
        } catch(err) {
            res.json(err);
        }
    }
    async uploadModifications(req, res : Response): Promise < void > {
        try {
            await this.uploadModifications(req.params.dir, req.files.package);
        } catch(err) {
            res.json(err);
        }
    }
}

export default new ServerData();
