import { Router } from "express";
import SERVER from '../const/req';
import ServerData from '../controllers/data';

const router = Router();

router.get(SERVER.GET_NMC_CONFIG, ServerData.getCurrentNMCConfig);
router.get(SERVER.GET_AVAILABLE_SERVER_LIST, ServerData.getAvailableServersList);
router.get(SERVER.GET_SERVER_ICON, ServerData.getServerIcon);
router.get(SERVER.GET_SERVER_STATUS, ServerData.getActiveServerData);
router.get(SERVER.GET_SERVER_LOG, ServerData.getServerLog);
router.post(SERVER.POST_SERVER, ServerData.uploadServer);
router.post(SERVER.UPLOAD_MODIFICATIONS, ServerData.uploadModifications);
router.delete(SERVER.DELETE_SERVER, ServerData.deleteServer);

export default router;