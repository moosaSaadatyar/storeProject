const express = require('express');
const controller = require('./project.controller');
const { upload } = require('../../middlewares/upload.middleware');

const uploadProject = upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'files', maxCount: 8 },
  { name: 'beforeImage', maxCount: 1 },
  { name: 'afterImage', maxCount: 1 },
]);

/**
 * روتر عمومی — مانت روی /api/projects
 */
const router = express.Router();
router.get('/', controller.publicList);
router.get('/:id', controller.publicGetById);

/**
 * روتر مدیریتی — مانت روی /api/admin/projects
 */
const adminRouter = express.Router();
adminRouter.get('/', controller.adminList);
adminRouter.get('/:id', controller.adminGetById);
adminRouter.post('/', uploadProject, controller.adminCreate);
adminRouter.put('/:id', uploadProject, controller.adminUpdate);
adminRouter.delete('/:id', controller.adminDelete);

module.exports = router;
module.exports.adminRouter = adminRouter;
