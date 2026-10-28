const express = require('express');
const controller = require('./contact.controller');

/** مانت روی /api/contact */
const router = express.Router();
router.post('/', controller.publicCreate);

/** مانت روی /api/admin/contact */
const adminRouter = express.Router();
adminRouter.get('/', controller.adminList);
adminRouter.put('/:id/status', controller.adminUpdateStatus);
adminRouter.delete('/:id', controller.adminDelete);

module.exports = router;
module.exports.adminRouter = adminRouter;
