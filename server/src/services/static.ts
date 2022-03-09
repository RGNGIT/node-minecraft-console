import singleton from '../const/var';
import fs from 'fs';

class StaticData {
    async getServerIcon(dir) {
        const path = `${
            singleton.root
        }\\java\\${dir}\\server-icon.png`;
        return fs.existsSync(path) ? Buffer.from(fs.readFileSync(path)).toString('base64') : null;
    }
    async writeServer(server, name, ver, icon, eula) {
        const path = `${singleton.root}\\java\\${name}`;
        return new Promise(async (res, rej) => {
            await fs.mkdir(path, async () => {
                await fs.writeFile(`${path}\\eula.txt`, `eula=${eula}`, (err) => {
                    rej(err);
                });
                await fs.writeFile(`${path}\\server-icon.png`, icon.data, (err) => {
                    rej(err);
                });
                await fs.writeFile(`${path}\\meta`, `{"Version":"${ver}", "MD5":"${server.md5}"}`, (err) => {
                    rej(err);
                });
                await fs.writeFile(`${path}\\server.jar`, server.data, (err) => {
                    rej(err);
                });
            });
            res("OK");
        });
    }
}

export default new StaticData();
