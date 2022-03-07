import { Router } from "express";
import SERVER from '../const/req';
import Operator from '../controllers/operator';

const router = Router();

router.get(SERVER.GET_SERVER_DIRS, Operator.getServerDirs);
router.patch(SERVER.SET_SERVER, Operator.setServer);
router.get(SERVER.START_SERVER, Operator.startServer);

export default router;