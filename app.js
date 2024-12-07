const express = require('express');
const session = require('express-session');
const authMiddleware = require('./middleware/authmid');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const twilio = require('twilio');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'housein',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

mongoose.connect(process.env.mongodburl);
app.set('view engine', 'ejs');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'css')));
app.use('/uploads', express.static('uploads'));
app.use(express.static(path.join(__dirname, 'img')));
app.use(express.static(path.join(__dirname, 'js')));

const useroute = require('./router/userroutes');
const workeroute = require('./router/workerroutes');
const basicroute = require('./router/basicroutes');

app.use(useroute);
app.use(workeroute);
app.use(basicroute);

require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_NUMBER;

const client = require('twilio')(accountSid, authToken);
const http = require('http');
const socketIo = require('socket.io');
const express = require('express');
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
    socket.on('startCall', (data) => {
        const { clientNumber, constructorNumber } = data;
        console.log(`Initiating call from: ${twilioNumber} to client: ${clientNumber}, connecting to constructor: ${constructorNumber}`);

        client.calls.create({
            url: `https://your-ngrok-url/connect-client?to=${encodeURIComponent(constructorNumber)}`,
            to: clientNumber,
            from: twilioNumber
        })
        .then(call => {
            console.log(`Call initiated: ${call.sid}`);
            socket.emit('callStatus', { status: 'inProgress', callSid: call.sid });
        })
        .catch(error => {
            console.error('Error initiating call:', error.message);
            socket.emit('callStatus', { status: 'failed', error: error.message });
        });
    });

    socket.on('disconnect', () => {});
});

app.post('/connect-client', (req, res) => {
    const to = req.query.to;

    const twilioResponse = new twilio.twiml.VoiceResponse();
    twilioResponse.say('Welcome to HouseIn, connecting your call please wait');
    twilioResponse.dial(to);

    res.type('text/xml');
    res.send(twilioResponse.toString());
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});



server.listen(3001, () => {
    console.log("Server running at http://localhost:3001");
});