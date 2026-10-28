const express = require('express');
const controller = require('./consultations.controller');
const { upload } = require('../../middlewares/upload.middleware');
const { validPhone } = require('../../middlewares/validate.middleware');

/** مانت روی /api/consultations */
const router = express.Router();
router.post('/', upload.array('files', 8), validPhone('phone'), controller.publicCreate);

/** مانت روی /api/admin/consultations */
const adminRouter = express.Router();
adminRouter.get('/', controller.adminList);
adminRouter.get('/:id', controller.adminGetById);
adminRouter.put('/:id/status', controller.adminUpdateStatus);
adminRouter.delete('/:id', controller.adminDelete);

module.exports = router;
module.exports.adminRouter = adminRouter;
