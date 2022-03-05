import { Router } from "express";
import SERVER from '../const/req';
import Operator from '../controllers/operator';
import ServerData from '../controllers/data';

const router = Router();

router.get(SERVER.GET_SERVER_DIRS, Operator.getServerDirs);
router.patch(SERVER.SET_SERVER, Operator.setServer);
router.get(SERVER.GET_NMC_CONFIG, ServerData.getCurrentNMCConfig);

export default router;