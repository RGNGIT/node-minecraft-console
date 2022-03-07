import consts from '../const/var';
import fs from 'fs';

class StaticData {
    async getServerIcon(dir) {
        const path = `${consts.root}\\java\\${dir}\\server-icon.png`;
        return fs.existsSync(path) ? Buffer.from(fs.readFileSync(path)).toString('base64') : null;
    } 
    async fetchModifications(dir) {
        
    }
}

export default new StaticData();