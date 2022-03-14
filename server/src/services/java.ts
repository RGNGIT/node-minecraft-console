import {spawn} from 'async-child-process';
import singleton from '../const/var';
import process from 'process';

class Java {
    async logger(proc) {
        return new Promise((res, rej) => {
            proc.stderr.on('data', (data) => {
                singleton.log.push(data.toString());
                console.log(data.toString());
                rej(data);
            });
            proc.stdout.on('data', (data) => {
                singleton.log.push(data.toString());
                console.log(data.toString());
                res(data);
            });
        })
    }
    async startProc() {
        if (singleton.proc != null) {
            await this.stopProc();
            singleton.log = [];
        }
        await process.chdir(`${
            singleton.root
        }/java/${
            singleton.selectedServer
        }`);
        singleton.proc = await spawn('java', [
            '-jar', `${
                singleton.root
            }/java/${
                singleton.selectedServer
            }/server.jar`,
            'nogui'
        ]);
        return await this.logger(singleton.proc);
    }
    async stopProc() {
        await singleton.proc.kill();
        return 'OK';
    }
}

export default new Java();
