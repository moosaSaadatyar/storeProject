const express = require('express');
const controller = require('./settings.controller');
const { upload } = require('../../middlewares/upload.middleware');

/** مانت روی /api/settings */
const router = express.Router();
router.get('/public', controller.publicGet);

/** مانت روی /api/admin/settings */
const adminRouter = express.Router();
adminRouter.get('/', controller.adminGet);
adminRouter.put('/', upload.array('logo', 1), controller.adminUpdate);

module.exports = router;
module.exports.adminRouter = adminRouter;
