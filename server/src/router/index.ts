import Data from './operator-route';

export function buildRoutes(app) {
    app.use('/api', Data);
}