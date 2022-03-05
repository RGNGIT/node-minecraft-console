import fs from 'fs';
import consts from '../const/var';

class Srv {
    async fetchServerDirs(): Promise < Array < string >> {
        let dir = await fs.readdirSync(`${consts.root}\\java`);
        return dir;
    }
}

export default new Srv();
