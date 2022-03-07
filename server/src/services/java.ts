import {spawn} from 'child_process';
import consts from '../const/var';

class Java {
    async logger(proc) {
        return new Promise((res, rej) => {
            proc.stderr.on('data', (data) => {
                res(data.toString());
            });
            proc.stdout.on('data', (data) => {
                res(data.toString());
            });
        });
    }
    async startProc() {
        let proc = spawn('java', [
            '-jar', `${
                consts.root
            }\\java\\${
                consts.selectedServer
            }\\server.jar`,
            'nogui'
        ]);
        return await this.logger(proc);
    }
    async stopProc() {

    }
}

export default new Java();
