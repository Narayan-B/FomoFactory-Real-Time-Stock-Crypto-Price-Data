require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const configureDb = require('./config/db');
const  stockCltr = require('./app/controllers/stockController');

const app = express();
const port = 4563;

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend URL
    methods: ['GET', 'POST'],
    credentials: true, // Allow credentials if needed
}));

configureDb();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: true,
        credentials: true,
    },
    allowEIO3: true,
});

io.on('connection', (socket) => {
    console.log('A user connected', socket.id);
});

// Start fetching stock data every 5 seconds
setInterval(() => {
    stockCltr.fetchAndSaveStockData(io);
}, 5000);

// Route to fetch stock data
app.post('/fetch', stockCltr.fetchAndSaveStockData);
app.get('/get', stockCltr.getStoredStockData); // Corrected route
app.get('/latest/:stock',stockCltr.getLatestStockValues)

server.listen(port, () => {
    console.log(`Server is running on ${port}`);
});