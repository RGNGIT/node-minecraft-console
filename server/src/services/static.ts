import singleton from '../const/var';
import fs from 'fs';
import sharp from 'sharp';
import unzip from 'unzip';

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
                    fs.writeFile(`${path}\\server-icon.raw`, icon.data, (err) => {
                        sharp(`${path}\\server-icon.raw`).resize(64, 64).toFile(`${path}\\server-icon.png`);
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
    async writePlugins(dir, pluginZip) {
        const path = `${
            singleton.root
        }\\java\\${dir}`;
        return new Promise((res, rej) => {
            fs.mkdir(`${path}\\plugins`, (err) => {
                fs.writeFile(`${path}\\plugin-package`, pluginZip.package, (err) => {
                    fs.createReadStream(`${path}\\plugin-package`)
                    .pipe(unzip.Extract({path: `${path}\\plugins`}));
                });
            });
        });
    }
    async deleteServer(dir) {
        return new Promise((res, rej) => {
            fs.unlink(`${
                singleton.root
            }\\java\\${dir}`, (err) => {
                err ? rej(err) : res('OK');
            });
        });
    }
}

export default new StaticData();
