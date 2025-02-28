const db_name = './jsonDB/user.json';
const users = require(`.${db_name}`);
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
    return jwt.sign(
        payload, 
        'very-long-secret-key', 
        {expiresIn: '90d'}
    )
}

const getAllUsers = (req, res) => {
    return res.status(200).json({
        status: "success",
        message: users
    })
};

const getUser = (req, res) => {
    const id = Number(req.params.id);
    const user = users.find(item => item.id === id);
    return res.status(200).json({
        status: "success",
        message: user
    })
};

const updateUser = (req, res) => {
    const id = Number(req.params.id);
    const index = users.findIndex(item => item.id===id)
    
    if (index < 0) {
        return res.status(400).json({
            status: "fail",
            message: `There's no User with id ${id}`
        })
    }

    const updatedUser = {...req.body, id: id};
    users.splice(index, 1, {...updatedUser})
    
    fs.writeFile(db_name, JSON.stringify(users), (err, data) => {
        if (err) return res.json(err)
        return res.status(201).json({
            status: "success",
            message: updatedUser
        })
    })
};

const createUser = (req, res) => {
    const newId = users.length ? users[users.length-1].id + 1 : 0;
    const password = req.body.password;
    const hashPassword = bcrypt.hashSync(password, 10);
    const today = new Date();
    const newUser = {...req.body, id: newId, password: hashPassword, createdAt: today, updatedAt: today};
    const result = {...req.body, id: newId, createdAt: today, updatedAt: today};
    users.push(newUser);
    
    delete result.password;

    result.token = generateToken({
        id: result.id
    })    
    
    fs.writeFile(db_name, JSON.stringify(users), (err, data) => {
        if (err) return res.json(err)
        return res.status(201).json({
            status: "success",
            message: result,
            // origin: newUser
        })
    })

}

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password){
        return res.status(400).json({
            status: 'fail',
            message: 'Please provide email and password'
        })
    }

    const result = users.find(item => item.email === email);
    
    if (!result || !(await bcrypt.compare(password, result.password))){
        return res.status(400).json({
            status: 'fail',
            message: 'Incorrect email or password'
        })
    }

    const token = generateToken({
        id: result.id
    })

    return res.status(201).json({
        status: 'success',
        userName: result.firstName,
        userType: result.userType,
        token
    })
};

const authentication = (req, res, next) => {
    let idToken = '';
    if (
        req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')) 
        {
            idToken = req.headers.authorization.split(' ')[1]
        }
    if (!idToken){
        return next(res.status(401).json({
            status: 'fail',
            message: 'Please login to get access'
        }))
    }

    const tokenDetail = jwt.verify(idToken, 'very-long-secret-key');
    // console.log('tokenDetail:', tokenDetail) // { id: 1, iat: 1735200737, exp: 1742976737 }
    const freshUser = users.find(item => item.id === tokenDetail.id)

    if (!freshUser){ 
        return next(res.status(400).json({
            status: 'fail',
            message: 'User no longer exists'
        }))
    }
    req.user = freshUser;
    return next();
};

const restrictTo = (...userType) => {
    const checkPermission = (req, res, next) => {
        // console.log(`userType: ${userType}; req_userType: ${req.user.userType}; result: ${userType.includes(req.user.userType)}`)
        if (!userType.includes(req.user.userType)) {
            return next(res.status(403).json({
                status: 'fail',
                message: 'You dont have permission to perform this action',
                hint: `userType: ${userType}; req_userType: ${req.user.userType}; result: ${userType.includes(req.user.userType)}`
            }))
        }
        return next();
    }
    return checkPermission;
}

const deleteUser = (req, res) => {
    const id = Number(req.params.id);
    const index = users.findIndex(item => item.id===id)
    
    if (index < 0) {
        return res.status(400).json({
            status: "fail",
            message: `There's no User with id ${id}`
        })
    }

    users.splice(index, 1)
    
    fs.writeFile(db_name, JSON.stringify(users), (err, data) => {
        if (err) return res.json(err)
        return res.status(201).json({
            status: "success",
            message: `User with id ${id} has been deleted successfully.`
        })
    })
};

module.exports = {
    getAllUsers, createUser, login, authentication, restrictTo
}