const express = require('express');
const { login, me } = require('./admin.controller');
const { requiredFields, maxLengths } = require('../../middlewares/validate.middleware');

const router = express.Router();

// مانت روی /api/admin/login — روتر ورود بدون احراز هویت
router.post(
  '/',
  requiredFields(['email', 'password']),
  maxLengths({ email: 120, password: 128 }),
  login
);

module.exports = router;
module.exports.me = me;
