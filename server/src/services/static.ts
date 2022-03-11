import singleton from '../const/var';
import fs from 'fs';
import sharp from 'sharp';
import unzipper from 'unzipper';

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
                        sharp(`${path}\\server-icon.raw`)
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
    async writeModifications(dir, zip, type) {
        const path = `${
            singleton.root
        }\\java\\${dir}`;
        function write(res, rej) {
            fs.writeFile(`${path}\\${type}-package`, zip.package.data, (err) => {
                let rstream = fs.createReadStream(`${path}\\${type}-package`)
                .pipe(unzipper.Extract({path: `${path}\\${type}s`}));
                rstream.on('finish', () => {
                    res('OK');
                });
            });
        }
        return new Promise((res, rej) => {
            if (!fs.existsSync(`${path}\\${type}s`)) {
                fs.mkdir(`${path}\\${type}s`, (err) => {
                    write(res, rej);
                });
            } else {
                write(res, rej);
            }
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
