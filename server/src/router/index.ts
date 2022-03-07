import Operator from './operator-route';
import Data from './data-route';

export function buildRoutes(app) {
    app.use('/api', Operator);
    app.use('/api', Data);
}