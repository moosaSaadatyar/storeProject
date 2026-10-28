const express = require('express');
const controller = require('./testimonials.controller');
const { maxLengths } = require('../../middlewares/validate.middleware');

/** مانت روی /api/testimonials */
const router = express.Router();
router.get('/', controller.publicList);
router.post('/', maxLengths({ customerName: 120, comment: 2000, projectType: 120 }), controller.publicCreate);

/** مانت روی /api/admin/testimonials */
const adminRouter = express.Router();
adminRouter.get('/', controller.adminList);
adminRouter.post('/', controller.adminCreate);
adminRouter.put('/:id', controller.adminUpdate);
adminRouter.put('/:id/approve', controller.adminApprove);
adminRouter.delete('/:id', controller.adminDelete);

module.exports = router;
module.exports.adminRouter = adminRouter;
