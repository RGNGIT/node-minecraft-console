import express from 'express';
import Server from './server';

require('dotenv').config();
const app = express();

(async function () {
    await Server.main(app);
    await app.listen(process.env.PORT, () => {
        console.log(`Консоль запустилась на порту ${process.env.PORT}`);
    });
})();