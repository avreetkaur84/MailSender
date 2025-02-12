import express from 'express'
import { upload } from '../middlewares/upload.js';
import { invitationMail, thankMail } from '../controllers/mail.controllers.js';

// const app = express();
const router = express.Router();

router.post("/thankmail", upload, thankMail);
router.post("/invitationmail", upload, invitationMail);

export default router;