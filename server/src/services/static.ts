import singleton from '../const/var';
import fs from 'fs';

class StaticData {
    async getServerIcon(dir) {
        const path = `${
            singleton.root
        }\\java\\${dir}\\server-icon.png`;
        return fs.existsSync(path) ? Buffer.from(fs.readFileSync(path)).toString('base64') : null;
    }
    async packServer(file, ver) {
        
    }
}

export default new StaticData();
