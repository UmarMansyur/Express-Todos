const router = require('express').Router();
const { signUp, login, logout } = require('../controllers/auth');

router.get('/login', (req, res, next)=> {
  try {
    if(req.user) {
      return res.redirect('/');
    }
    return res.render('login');
  } catch (error) {
    next(error);
  }
});
router.post('/login', login);

router.get('/signup', (req, res, next) => {
  try {
    if(req.user) {
      return res.redirect('/');
    }
    return res.render('signup');
  } catch (error) {
    next(error)
  }
});
router.post('/signup', signUp);
router.post('/logout', logout);



module.exports = router;