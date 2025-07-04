require('dotenv').config()
express = require("express");
const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: "true" }));
var admin = require("firebase-admin");
var serviceAccount = require("./tradepix1-30390-firebase-adminsdk-4ex60-3700b70a6e.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://tradepix1-30390-default-rtdb.firebaseio.com"
});

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

const notification_options = {
    priority: "high",
   // timeToLive: 60  60  24
};



app.post('/sendnotification', async (req, res, next) => {
    let notificationType = "";
    const message = {
        'notification': {
            'body': 'Body Hello',
            'title': 'Title nikhi;l'
        },
        'data': {
            name: "Nikhil"
        }
    }
    const options = notification_options

    var EquityNotificationUsersRef = admin.firestore().collection(notificationType);
    EquityNotificationUsersRef
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                admin.messaging().sendToDevice(doc.id, message, options)
                    .then(response => {
                        res.status(200).send({ res: "Notification sent successfully" })
                    })
                    .catch(error => {
                        console.log(error);
                    });
            });
            res.status(200).send({ res: "Notification sent successfully" })
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
});
