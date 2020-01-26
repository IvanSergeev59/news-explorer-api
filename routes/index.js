const router = require('express').Router();

const helmet = require('helmet');


router.use(helmet());
const auth = require('../middlewares/auth.js');
const defaultUrl = require('../middlewares/default');
router.use('/signin', require('../routes/login'));
router.use('/signup', require('../routes/signUp'));
router.use('/users', auth, require('../routes/users'));
router.use('/articles', auth, require('../routes/articles'));

router.use('/', auth, defaultUrl);

module.exports = router;
