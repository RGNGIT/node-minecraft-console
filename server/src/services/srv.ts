import fs from 'fs';
import consts from '../const/var';

class Srv {
    async fetchServerDirs(): Promise < Array < string >> {
        let dir = await fs.readdirSync(`${consts.root}\\java`);
        return dir;
    }
    async fetchServerMeta(dir) {
        let meta = await fs.readFileSync(`${consts.root}\\java\\${dir}\\meta`);
        return JSON.parse(meta.toString());
    }
}

export default new Srv();
