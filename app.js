import dotenv from 'dotenv';
dotenv.config({
    path: './.env',
});
import {app, PORT, io, httpServer} from './server.js';
import {connectDB} from './connectDataBase.js';

connectDB()
.then(() => console.log("Connected to MongoDB"))
.catch((error) => console.log(error));

import "./socket.js"

httpServer.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});
