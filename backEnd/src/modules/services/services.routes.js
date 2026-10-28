const express = require('express');
const controller = require('./services.controller');
const { upload } = require('../../middlewares/upload.middleware');

/** مانت روی /api/services */
const router = express.Router();
router.get('/', controller.publicList);

/** مانت روی /api/admin/services */
const adminRouter = express.Router();
adminRouter.get('/', controller.adminList);
adminRouter.post('/', upload.array('image', 1), controller.adminCreate);
adminRouter.put('/:id', upload.array('image', 1), controller.adminUpdate);
adminRouter.delete('/:id', controller.adminDelete);

module.exports = router;
module.exports.adminRouter = adminRouter;
