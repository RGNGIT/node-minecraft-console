import {spawn} from 'child_process';
import singleton from '../const/var';
import process from 'process';

class Java {
    async logger(proc) {
        return new Promise((res, rej) => {
            proc.stderr.on('data', (data) => {
                singleton.log.push(data.toString());
                rej(data);
            });
            proc.stdout.on('data', (data) => {
                singleton.log.push(data.toString());
                res(data);
            });
        })
    }
    async startProc() {
        if (singleton.proc != null) {
            this.stopProc();
            singleton.log = [];
        }
        process.chdir(`${
            singleton.root
        }/java/${
            singleton.selectedServer
        }`);
        singleton.proc = spawn('java', [
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
        singleton.proc.kill();
    }
}

export default new Java();
