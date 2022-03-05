import consts from './const/var';
import {buildRoutes} from './router/index';

class Server {
    async defineConsts() {
        consts.root = __dirname;
    }
    async main(app) {
        await this.defineConsts();
        await buildRoutes(app);
    }
}

export default new Server();