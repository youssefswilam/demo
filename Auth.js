const router = require("express").Router();
module.exports = router;

const conn = require("../DB/dbconnections");
const authorized= require("../middleware/authorize");
const { body, validationResult } = require("express-validator");
const util = require("util"); // helper
const bcrypt = require("bcrypt");
const crypto = require("crypto");
 
// Login,
router.post(
    "/login",
    body("email").isEmail().withMessage("please enter a valid email"),
body("password")
.isLength({min: 8, max:12})
.withMessage("password should be between (8-21) character"),

async(req,res)=> {
try{
// Vlidation Request[manual,express validation]
const errors = validationResult(req);
if (!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()});
}

// Check if email exist 
const query = util.promisify(conn.query).bind(conn); // transform query mysql to promise to use [awiat / async]
const user= await query("select * from users where email = ?",
[req.body.email]
);
if(user.length == 0){
    res.status(404).json({

        errors: [{
            "msg":"email or password not found!",
        },
    ],
    });
}

// 
const checkPassword = await bcrypt.compare(
    req.body.password,
    user[0].password );
    if (checkPassword){
        delete user[0].password
        res.status(200).json(user[0])
    } else {
        res.status(404).json({
            errors:[
                {
                    msg: "email or password not found!"
                },
            ],
        })
    }






} catch(err){
    console.log(err);

    res.status(500).json({err:err});
}
});

// Registration

router.post(
    "/register",
    body("email").isEmail().withMessage("please enter a valid email"),
body("name")
.isString()
.withMessage("name should be between (10-20) character")
.isLength({min:10,max:20}),
body("password")
.isLength({min: 8, max:12})
.withMessage("password should be between (8-21) character"),

async(req,res)=> {
try{
// Vlidation Request[manual,express validation]
const errors = validationResult(req);
if (!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()});
}

// Check if email exist 
const query = util.promisify(conn.query).bind(conn); // transform query mysql to promise to use [awiat / async]
const checkEmailExists= await query("select * from users where email = ?",
[req.body.email]
);
if(checkEmailExists.length > 0){
    res.status(404).json({

        errors: [{
            "msg":"email already exists",
        },
    ],
    });
}



// 3- Prepare object user to save 
const userData = {
name: req.body.name,
email: req.body.email,
password: await bcrypt.hash(req.body.password, 10),
phone: req.body.phone,
token: crypto.randomBytes(16).toString("hex"),

};

// insert user object into DB
await query("insert into users set?",userData);
delete userData.password;
res.status(200).json(userData);


} catch(err){
    console.log(err);

    res.status(500).json({err:err});
}
});
