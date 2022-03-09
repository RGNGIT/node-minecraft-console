import singleton from '../const/var';
import fs from 'fs';
import sharp from 'sharp';

class StaticData {
    async getServerIcon(dir) {
        const path = `${
            singleton.root
        }\\java\\${dir}\\server-icon.png`;
        return fs.existsSync(path) ? Buffer.from(fs.readFileSync(path)).toString('base64') : null;
    }
    async writeServer(server, name, ver, icon, eula) {
        const path = `${
            singleton.root
        }\\java\\${name}`;
        return new Promise((res, rej) => {
            fs.mkdir(path, async () => {
                let writeEula = new Promise((res1, rej1) => {
                    fs.writeFile(`${path}\\eula.txt`, `eula=${eula}`, (err) => {
                        err ? rej1(err) : res1('OK');
                    });
                });
                let writeIcon = new Promise((res2, rej2) => {
                    fs.writeFile(`${path}\\server-icon-raw.png`, icon.data, (err) => {
                        sharp(`${path}\\server-icon-raw.png`)
                        .resize(64, 64)
                        .toFile(`${path}\\server-icon.png`);
                        err ? rej2(err) : res2('OK'); 
                    });
                }); 
                let writeMeta = new Promise((res3, rej3) => {
                    fs.writeFile(`${path}\\meta`, `{"Version":"${ver}", "MD5":"${
                        server.md5
                    }"}`, (err) => {
                        err ? rej3(err) : res3('OK');
                    });
                }); 
                let writeServer = new Promise((res4, rej4) => {
                    fs.writeFile(`${path}\\server.jar`, server.data, (err) => {
                        err ? rej4(err) : res4('OK');
                    });
                });
                res(await Promise.allSettled([writeEula, writeIcon, writeMeta, writeServer]));
            });
        });
    }
}

export default new StaticData();
