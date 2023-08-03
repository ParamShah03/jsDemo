const express = require('express');
const app2 = express();
const multer = require('multer');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const port = process.env.PORT || 4000;
const bodyParser = require('body-parser');
const nodeMailer = require('nodemailer');
const bcrypt = require('bcrypt');
const { log } = require('console');

// path to couch upload image
const couchImgPath = "D:/Param Shah/StudioProjects/Param_training/jsDemo/upload/images/couchs/";
const chairImgPath = "D:/Param Shah/StudioProjects/Param_training/jsDemo/upload/images/chairs/";
const featureImgPath = "D:/Param Shah/StudioProjects/Param_training/jsDemo/upload/images/features/";

// for editing an image
var multerEditImg;
//extension of different file request
let ext;


//to remove cross-origin-no-access-control error
const cors = require("cors");
const corsOptions = {
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
    methods: '*',
}
app2.use(cors(corsOptions));


//initializing from models
const chairModel = require('./api/models/chair');
const couchModel = require('./api/models/couch');
const featureModel = require('./api/models/feature');
const userModel = require('./api/models/user');
const { METHODS } = require('http');

//body parsing property
app2.use(bodyParser.json());
app2.use(bodyParser.urlencoded({ extended: false }));


//connecting to db mongodb atlas
mongoose.connect('mongodb+srv://ParamShah03:Param%402003@jsdemo.levjypi.mongodb.net/?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)
    .then(() => console.log("db is connected"))
    .catch((err) => console.log(err, "it has an error"));

// SMTP transport
var transporter = nodeMailer.createTransport({
    service: 'gmail',
    secure: true,
    auth: {
        user: "shaparam03@gmail.com",
        pass: "kicdocuiywlizlcn"
    }
});

// handling forgot pass word requests
app2.use('/forgotPassword', (req, res) => {
    const emailAdd = req.body.email;

    userModel.find({ email: emailAdd })
        .exec()
        .then((user) => {
            var mailOptions = {
                from: "shaparam03@gmail.com",
                to: emailAdd,
                subject: "Forgot Password",
                html: ` <h1>Hello ${user[0].name}</h1>
                    <h3>Your password for the acoount ${user[0].email} is: ${user[0].password}</h3>`
            }

            // sending email to emailAdd
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Email sent: " + info.messageId);
                }
            });
        })
        .catch((err) => {
            res.json({
                "Error": err
            })
        });

    res.send("forgot password");
});

// initializing id for all the 
var id;
app2.use('/upload', (req, res, next) => {
    id = new mongoose.Types.ObjectId();
    next();
});

// storing immage name as objectID
//let id = new mongoose.Types.ObjectId();


//creating storage path for uploaded image file
const storage1 = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        //console.log(file.originalname);
        multerEditImg = id + path.extname(file.originalname);
        setTimeout(function () {
            return cb(null,
                `${id + path.extname(file.originalname)}`
            );
        }, 3000);
    }
});

// storing couch image ad id
const storage2 = multer.diskStorage({
    destination: './upload/images/couchs',
    filename: (req, file, cb) => {
        // console.log("multer:",id+path.extname(file.originalname));
        multerEditImg = id + path.extname(file.originalname);
        setTimeout(function () {
            return cb(null,
                `${id + path.extname(file.originalname)}`
            );
        }, 3000);

    }
});

// storing chair image as id
const storage3 = multer.diskStorage({
    destination: './upload/images/chairs',
    filename: (req, file, cb) => {
        // console.log(id+path.extname(file.originalname));
        multerEditImg = id + path.extname(file.originalname);
        setTimeout(function () {
            return cb(null,
                `${id + path.extname(file.originalname)}`
            );
        }, 3000);
    }
});

// storing feature image as id
const storage4 = multer.diskStorage({
    destination: './upload/images/features',
    filename: (req, file, cb) => {
        console.log(id + path.extname(file.originalname));
        multerEditImg = id + path.extname(file.originalname);
        setTimeout(function () {
            return cb(null,
                `${id + path.extname(file.originalname)}`
            );
        }, 3000);
    }
});

//multer storage engine
const upload1 = multer({
    storage: storage1,
});
const upload2 = multer({
    storage: storage2,
});
const upload3 = multer({
    storage: storage3,
});
const upload4 = multer({
    storage: storage4,
});

//display uploaded image on browser
app2.use('/image', express.static('upload/images'));

//upload other images
app2.post("/upload", upload1.single('image'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:4000/image/${req.file.filename}`
    });
});

//upload couch images or edit
app2.post("/upload/couch/:couchID",
    upload2.single('image'),
    (req, res) => {
        let couchID = req.params.couchID;
        console.log("post:", couchID);

        if (couchID === "add") {
            // post the record
            let couchImage = new couchModel({
                _id: id,
                name: id + path.extname(req.file.originalname),
                title: req.body.title,
                description: req.body.description
            })
            couchImage.save()
                .then((couch) => {
                    console.log('successfully uploaded couch');
                })
                .catch((err) => {
                    console.log(err);
                    try {
                        fs.unlinkSync(couchImgPath + id + path.extname(req.file.originalname));
                        return true;
                    } catch (e) {
                        console.log(e);
                        return false;
                    }
                });
            res.json({
                success: 1,
                image_url: `http://localhost:4000/image/${req.file.filename}`,
                name: req.file.originalname
            });
            // res.json({
            //     message: "post"
            // })


        }
        else {
            //edit the couch record
            // get extension of the file of name couchID
            fs.readdirSync(couchImgPath).every(file => {
                if (file.split('.')[0] == couchID) {
                    ext = path.extname(file);
                    return false;
                }

                return true;
            });
            
            couchModel.findOneAndUpdate({ _id: couchID },
                {
                    $set: {
                        "title": req.body.title,
                        "description": req.body.description,
                        "name": 
                            (req.file == null)
                            ? couchID + ext
                            : couchID + path.extname(req.file.originalname)
                            
                    }
                }
            )
                .then(result => {
                    console.log("updated couch");
                    if (req.file) {
                        setTimeout(function () {
                            // delete the old one
                            try {
                                // get extension of the file of name couchID
                                fs.readdirSync(couchImgPath).every(file => {
                                    if (file.split('.')[0] == couchID) {
                                        ext = path.extname(file);
                                        return false;
                                    }

                                    return true;
                                });
                                fs.unlinkSync(couchImgPath + couchID + ext);
                            } catch (e) {
                                console.log(e);
                            }

                            // rename the new file as old
                            fs.rename(
                                couchImgPath + multerEditImg,
                                couchImgPath + couchID + path.extname(req.file.originalname),
                                (error) => {
                                    if (error) {
                                        console.log(error);
                                    }
                                }
                            )
                        }, 0);
                    }
                })
                .catch(err => {
                    console.log(err);

                })


            res.end();
        }

    });

//get request for uploaded couchs
app2.get("/upload/couchs", (req, res) => {
    couchModel.find()
        .exec()
        .then(docs => {
            res.json(docs);

            //console.log(couchList);
        })
        .catch(err => {
            console.log(err);
            res.json({
                error: err
            })
        })
});

// get details of a particular couch
app2.get("/upload/couch/:couchId", (req, res) => {
    const couchID = req.params.couchId;
    couchModel.findById(couchID)
        .exec()
        .then(couch => {
            if (couch) {
                res.json(
                    couch,
                );
            } else {
                res.json({
                    message: "no valid entry found"
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.json({
                error: err
            });
        });
});

// edit couch 
app2.patch("/upload/couch/:couchId", (req, res) => {

    let couchID = req.params.couchId;
    couchModel.findOneAndUpdate({ _id: couchID }, {
        $set: req.body
    })
        .exec()
        .then(result => {
            console.log("updated couch");
            res.json({
                message: 'couch updated',
            });
        })
        .catch(err => {
            console.log(err);
            res.json({
                error: err
            });
        })
});

// delete for visual panel couch
app2.delete("/upload/couch/:couchId", (req, res) => {
    let id = req.params.couchId;
    couchModel.deleteOne({ _id: id })
        .then(() => {
            console.log('couch deleted');
            setTimeout(function () {
                try {
                    fs.unlinkSync(couchImgPath + req.body.name);
                    return true;
                } catch (e) {
                    return false;
                }
            }, 3000);


        })
        .catch(err => {
            console.log(err);
        });

    res.end();

});

//upload chair images or edit
app2.post("/upload/chair/:chairID",
    upload3.single('image'),
    (req, res) => {
        let chairID = req.params.chairID;
        console.log("post:", chairID);

        if (chairID === "add") {
            // post the record
            console.log(path.extname(req.file.originalname));
            const chairImage = new chairModel({
                _id: id,
                name: id + path.extname(req.file.originalname),
            })
            chairImage.save()
                .then((chair) => {
                    console.log('successfully uploaded chair');
                })
                .catch((err) => {
                    console.log(err);
                    // delete from folder due to errors
                    try {
                        fs.unlinkSync(chairImgPath + id + path.extname(req.file.originalname));
                    } catch (e) {
                        console.log(e);
                    }
                });

            res.json({
                success: 1,
                image_url: `http://localhost:4000/image/${req.file.filename}`,
                name: req.file.originalname
            });
            // res.json({
            //     message: "post"
            // })

        }
        else {
            //edit the record
            console.log("updated chair");
            if (req.file) {
                setTimeout(function () {
                    // delete the old one
                    try {
                        fs.unlinkSync(chairImgPath + chairID + path.extname(req.file.originalname));
                    } catch (e) {
                        console.log(e);
                    }

                    // rename the new file as old
                    fs.rename(
                        chairImgPath + multerEditImg,
                        chairImgPath + chairID + path.extname(req.file.originalname),
                        (error) => {
                            if (error) {
                                console.log(error);
                            }
                        }
                    )
                }, 3000);
            }

            // res.json({
            //     message: "edit"
            // })
            res.end();

        }

    });

//get request for chairs
app2.get("/upload/chairs", (req, res) => {
    chairModel.find()
        .exec()
        .then(docs => {
            res.json(docs);

            //console.log(chairList);
        })
        .catch(err => {
            console.log(err);
            res.send().json({
                error: err
            });
        });
});

// get request for specific chair
app2.get("/upload/chair/:chairId", (req, res) => {
    const chairID = req.params.chairId;
    chairModel.findById(chairID)
        .exec()
        .then(chair => {
            if (chair) {
                res.json(
                    chair,
                );
            } else {
                res.json({
                    message: "no valid entry found"
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.json({
                error: err
            });
        });
});

// delete request for chairs
app2.delete("/upload/chair/:chairId", (req, res) => {
    let id = req.params.chairId;
    chairModel.deleteOne({ _id: id })
        .then(() => {
            console.log('chair deleted');
            setTimeout(function () {
                try {
                    fs.unlinkSync(chairImgPath + req.body.name);
                    return true;
                } catch (e) {
                    return false;
                }
            }, 3000);

        })
        .catch(err => {
            console.log(err);
        });

    res.end();
});

//upload feature images or edit
app2.post("/upload/feature/:featureID",
    upload4.single('image'),
    (req, res) => {
        let featureID = req.params.featureID;
        console.log("post:", featureID);

        if (featureID === "add") {
            // post the record
            let featureImage = new featureModel({
                _id: id,
                image: id + path.extname(req.file.originalname),
                name: req.body.title,
                description: req.body.description
            })
            featureImage.save()
                .then((feature) => {
                    console.log(feature.id);
                    console.log('successfully uploaded feature');

                })
                .catch((err) => {
                    console.log(err);
                    try {
                        fs.unlinkSync(featureImgPath + id + path.extname(req.file.originalname));
                    } catch (e) {
                        console.log(e);
                    }
                });

            res.json({
                success: 1,
                image_url: `http://localhost:4000/image/${req.file.filename}`,
                name: req.file.originalname
            });
            // res.json({
            //     message: "post"
            // })    

        }
        else {

            //edit the feature record
            console.log("updated feature");
            if (req.file) {
                setTimeout(function () {
                    // delete the old one
                    try {
                        fs.unlinkSync(featureImgPath + featureID + path.extname(req.file.originalname));
                    } catch (e) {
                        console.log(e);
                    }

                    // rename the new file as old
                    fs.rename(
                        featureImgPath + multerEditImg,
                        featureImgPath + featureID + path.extname(req.file.originalname),
                        (error) => {
                            if (error) {
                                console.log(error);
                            }
                        }
                    )
                }, 3000);
            }

            // res.json({
            //     message: "edit"
            // })
            res.end();
        }

    });

//get request for features
app2.get("/features", (req, res) => {
    featureModel.find()
        .exec()
        .then(docs => {
            res.json(docs);
            docs.map(feature => {
                //console.log(feature.name);
            });
        })
        .catch(err => {
            console.log(err);
            res.json({
                error: err
            });
        });
});

// get request for specific feature
app2.get("/feature/:featureId", (req, res) => {
    const featureID = req.params.featureId;
    featureModel.findById(featureID)
        .exec()
        .then(feature => {
            if (feature) {
                res.json(
                    feature,
                );
            } else {
                res.json({
                    message: "no valid entry found"
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.json({
                error: err
            });
        });
});

// delete request for feature
app2.delete("/upload/feature/:featureId", (req, res) => {
    let id = req.params.featureId;
    featureModel.deleteOne({ _id: id })
        .then(() => {
            console.log('feature deleted');
            setTimeout(function () {
                try {
                    fs.unlinkSync(featureImgPath + req.body.name);
                    return true;
                } catch (e) {
                    return false;
                }
            }, 3000);

        })
        .catch(err => {
            console.log(err);

        });

    res.end();
});

//create a user
app2.post("/user", (req, res) => {
    const user = new userModel({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });

    // encrypting password
    user.pre('save', async function(next){
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(this.password, salt);
            this.password = hashedPassword;
            next();
        } catch (error) {
            next(error);
        }

    });

    user.save()
        .then(() => {
            res.json({
                message: "User created successfully"
            })
        })
        .catch((err) => {
            res.json({
                error: err
            })
        });
});

//get request for users
app2.get("/users", (req, res) => {
    userModel.find()
        .exec()
        .then(docs => {
            res.json(docs);
            docs.map(user => {
                //console.log(user.password);
            });
        })
        .catch(err => {
            console.log(err);
            res.send().json({
                error: err
            });
        });
});

//error handling for multer
app2.use(errHandler);
function errHandler(err, req, res, next) {
    if (err instanceof multer.MulterError) {
        res.json({
            success: 0,
            message: err.message
        })
    }
}

//listen for connections
app2.listen(port, () => {
    console.log("server up and running on " + port);
});

