const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../users/user.model')
const State = require('../users/state.model')
const City = require('../users/city.model')
const db = 'mongodb://localhost:27017/angular'

mongoose.connect(db, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Database connected');
    }
})
module.exports = {
    authenticate,
    authenticateUser,
    getCity,
    getAllCities,
    matchUsername,
    getAllStates,
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function authenticate({ username, password }) {
    const user = await User.findOne({ username });
    if (user && bcrypt.compareSync(password, user.hash)) {
        const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '7d' });
        return {
            ...user.toJSON(),
            token
        };
    }
}

async function authenticateUser({id,oldpassword}) {
    console.log('oldpassword ==>'+id+'--'+oldpassword);
    const user = await User.findById(id);
    if (user && bcrypt.compareSync(oldpassword, user.hash)) { // change here
        const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '7d' });
        return {
            ...user.toJSON(),
            token
       };
    }
}



async function getCity(name) {
    const city = await City.find( {state : name});
    //console.log('city==>'+city);
    return city;
}


async function getAll() {
    return await User.find();
}

async function getAllStates() {
    return await State.find();
}

async function getAllCities() {
    return await City.find();
}

async function getById(id) {
    return await User.findById(id);
}

async function matchUsername(userParam) {
   // console.log('id==>'+id);
    const user = await User.findOne({ username: userParam.username});
   // console.log('user==>'+user);
    if (user) { // change here
        const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '7d' });
        return {
            ...user.toJSON(),
            token
       };
    }
    // validate
   // console.log('userParam==>'+userParam);
   // if (await User.findOne({ username: userParam.username})) {
    //    return  User.findOne({ username: userParam.username});
       // throw 'Username "' + userParam.username + '" is already taken';
  //  }
}

async function create(userParam) {
    // validate
    if (await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    const user = new User(userParam);

    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // save user
    await user.save();
}

async function update(id, userParam) {
    const user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';
    if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // copy userParam properties to user
    Object.assign(user, userParam);

    await user.save();
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}