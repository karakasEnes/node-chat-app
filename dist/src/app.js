//dot ENV
import dotenv from 'dotenv';
dotenv.config();
//lib imports
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
//file imports
//express Setup
const app = express();
//PORT
const STATIC_PORT = 4343;
const PORT = process.env.PORT || STATIC_PORT;
//static paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));
//routes!
app.get('/', (_req, _res) => {
    _res.render('index');
});
app.listen(PORT, () => {
    console.log('listenin on port ' + PORT);
});
