const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Person = require("./../models/imageData");
//! UTILS
const Razorpay=require('razorpay')
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const Email = require("./../utils/email");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
}

// Set up Multer storage with dynamic directory creation
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Extract the name from the request (assuming it's sent in the body)
        const personName = req.body.name || 'default'; // Use a default name if not provided
        const dir = path.join(uploadPath, personName); // Create a directory based on the person's name

        // Create the directory if it doesn't exist
        fs.mkdirSync(dir, { recursive: true });
        
        cb(null, dir); // Use the new directory
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`); // Keep original extension
    }
});

// Update here
//Ubj1uzVzanlq7aJY
//rahulrathaur18898
exports.upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|mp4|jpg|png|gif/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new AppError('Error: File upload only supports the following filetypes - ' + fileTypes, 400), false);
        }
    },
});
exports.createPerson = async (req, res) => {
    try {
        const { name, age } = req.body;
        
        // Get the paths of all uploaded images
        const images = req.files.map(file => file.path); // Use req.files for multiple files

        // Create a new person record in the database
        const newPerson = await Person.create({
            name,
            age,
            images, // Store the array of image paths
        });

        res.status(201).json({
            status: 'success',
            data: {
                newPerson,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'fail',
            message: 'An error occurred while creating the person',
        });
    }
};

exports.makerequest = async (req, res) => {
    try{
        const razorpay = new Razorpay({
            key_id:"rzp_test_TBBRXgPa4yzuqK",
            key_secret:"3zD9xctvxco5aKNfKaNoaf7D",
        })
    
        const options  =req.body;
        const order =await razorpay.orders.create(options);
    
        if(!order){
            return res.status(500).send("Error");
        }
        res.json(order);

    }catch(err){
        res.status(500).send(err);
        console.log(err);
    }

};

exports.validation = async (req, res) => {
    const{razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body;

    const sha =crypto.createHmac("sha256","3zD9xctvxco5aKNfKaNoaf7D");

    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);

    const digest = sha.digest("hex");

    if(digest!==razorpay_signature){
        return res.status(400).json({msg:"Transaction is not legit!"})
    }

    res.json({
        msg:"Success",
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
    });

};

exports.buy = async (req, res) => {
    try {
        const { name,  address, phoneNumber } = req.body; // Extract address and phone number from request body


        // Create a new person record in the database
        const newPerson = await Person.create({
            name,
            address, // Include address in the person record
            phoneNumber, // Include phone number in the person record
        });

        res.status(201).json({
            status: 'success',
            data: {
                newPerson,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'fail',
            message: 'An error occurred while creating the person',
        });
    }
};



const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};


const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };
    if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

    res.cookie("jwt", token, cookieOptions);

    // Remove password from output
    user.password = undefined;
    if (statusCode == 200) {
        res.status(statusCode).json({
            status_msg: "success",
            status_code: statusCode,
            token,
            data: {
                user,
            },
        });
    }
};


exports.signup = async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    })

    const jwt_token = signToken(newUser._id);

    //! SEND THE WELCOME EMAIL TO THE USER
    const url = `${req.protocol}://${req.get('host')}/me`;
    console.log(url);
    await new Email(newUser, url).sendWelcome();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(200).json({
        status: 'success',
        data: {
            newUser
        },
        jwt_token
    })
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    // Checking for existence of email and password
    if (!email || !password) {
        return next(new AppError("Please provide Email and Password!", 400));
    }

    // Checking if user exists and credentials are correct
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError("Incorrect email or password", 400));
    }
    // if everything is okay, send the token to client
    createSendToken(user, 200, res);
};


//! FORGET PASSWORD
exports.forgetPassword = catchAsync(async (req, res, next) => {
    const eMail = req.body.email;
    const user = await User.findOne({ email: eMail });
    //1) Check if user email exist in db
    if (!user) {
        return next(new AppError('There is no user with email address.', 404));
    }
    //2) Generate a random reset token/password
    const resetToken = user.createForgetPasswordResetToken();
    await user.save({ validateBeforeSave: false });


    try {
        //3) send it to users email
        const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

        // const message = `Forgot your password? Send a PATCH req with your new password and confirm password to: ${resetURL} \n if you didn't forgot your password then please ignore this email`;
        // await sendEmail({
        //   email: eMail,
        //   subject: 'This link is only valid for next 10 mins',
        //   message: message
        // })

        await new Email(user, resetURL).sendPasswordReset();

        res.status(200).json({
            status: "success",
            message: "Token sent to email",
        });
    } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
    }

    return next(
        new AppError('There was an error sending the email. Try again later!'),
        500
    );
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    //1) GET USER BASED ON THE TOKEN HE FROM THE URL PARAMETER
    const tokenFromUserParam = req.params.token;
    //2) HASH THE TOKEN WITH CRYPTO TO MATCH IT FROM DB(ALREADY MADE AWAILABLE IN DB AT THE TIME OF FORGET PASSWORD REQ)
    const hashedToken = crypto
        .createHash("sha256")
        .update(tokenFromUserParam)
        .digest("hex");
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });

    //If token has expire
    if (!user) {
        return next(new AppError("Token is invalid or has already expired!", 400));
    }

    //3) SET NEW PASSWORD AND MAKE THE TOKEN AND EXPIRED TIME TO 0
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    //3) UPDATE changedPasswordAt property from db
    //4) LOG THE USER IN, SEND JWT
    const token = signToken(user._id);

    res.status(200).json({
        status: "success",
        token,
    });
});



