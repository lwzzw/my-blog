const router = require('express').Router()
const blog = require('./blog');
const admin = require('./admin');

// router
router.use('/api-blog', blog);
router.use('/api-admin', admin);

module.exports = router