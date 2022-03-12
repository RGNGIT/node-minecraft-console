import fs from 'fs';
import singleton from '../const/var';

class Srv {
    async fetchServerDirs(): Promise < Array < string >> {
        let dir = await fs.readdirSync(`${
            singleton.root
        }/java`);
        return dir;
    }
    async fetchServerMeta(dir) {
        let meta = await fs.readFileSync(`${
            singleton.root
        }/java/${dir}/meta`);
        return JSON.parse(meta.toString());
    }
    async fetchModifications(dir) {
        const path = `${
            singleton.root
        }/java/${dir}`;
        return fs.existsSync(`${path}/mods`) || fs.existsSync(`${path}/plugins`) ? fs.readdirSync(`${path}/${
            (fs.existsSync(`${path}/mods`) ? 'mods' : 'plugins')
        }`) : null;
    }
    async sendCommand(command) {
        singleton.proc.stdin.write(command);
    }
}

export default new Srv();
