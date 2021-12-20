const express = require('express');
const router = express.Router();
const multer = require('multer');
const cors = require('cors');
const userService = require('./user.service');

// routes
router.post('/authenticate', authenticate);
router.post('/authenticateuser', authenticateUser);
router.post('/register', register);
//router.get('/', getAll);
router.get('/current', getCurrent);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);
router.post('/username', username);
router.get('/', getAllStates);
router.get('/city/:name', getCity);
router.get('/allcity', getAllCities);

module.exports = router;

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}

function authenticateUser(req, res, next) {
    userService.authenticateUser(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Please provide correct old password' }))
        .catch(err => next(err));
}



function getCity(req, res, next) {
    userService.getCity(req.params.name)
        .then(city => res.json(city))
        .catch(err => next(err));
}

function username(req, res, next) {
    userService.matchUsername(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'username not found' }))
        .catch(err => next(err));
}

function register(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getAllStates(req, res, next) {
    userService.getAllStates()
        .then(state => res.json(state))
        .catch(err => next(err));
}

function getAllCities(req, res, next) {
    userService.getAllCities()
        .then(city => res.json(city))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    userService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}

const DIR = '../dashboard/src/assets';
const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, DIR)
    },
    filename: (req, file, callBack) => {
        callBack(null, `${file.originalname}`)
    }
  })
  
const upload = multer({ storage: storage })
   
//let upload = multer({ dest: 'uploads/' })



  router.post('/file', upload.single('file'), (req, res, next) => {
    const file = req.file;
    console.log('--'+file.filename);
    if (!file) {
      const error = new Error('No File')
      error.httpStatusCode = 400
      return next(error)
    }
      res.send(file);
  })

  router.get('/username/:username',(req, res) =>{
    let username = req.params.username;
    console.log('username'+username);
    User.findOne({username: username}, function (err, user){
    res.json(user);
    });
    })

