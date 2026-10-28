const express = require('express');
const controller = require('./faqs.controller');
const { maxLengths } = require('../../middlewares/validate.middleware');

/** مانت روی /api/faqs */
const router = express.Router();
router.get('/', controller.publicList);

/** مانت روی /api/admin/faqs */
const adminRouter = express.Router();
adminRouter.get('/', controller.adminList);
adminRouter.post('/', maxLengths({ question: 300, answer: 3000 }), controller.adminCreate);
adminRouter.put('/:id', maxLengths({ question: 300, answer: 3000 }), controller.adminUpdate);
adminRouter.delete('/:id', controller.adminDelete);

module.exports = router;
module.exports.adminRouter = adminRouter;
