import 'dotenv/config';
import mongoose from "mongoose";
import express from 'express';
import cors from 'cors';
import swaggerDocs from './util/swagger.js';
import Counter from "./models/Counter.js"

// routes
import registerRoutes from "./routes/DrawingRegister.js"
import categoryRoutes from "./routes/Categories.js"
import issueSheetRoutes from "./routes/IssueSheet.js"
import userRoutes from "./routes/User.js"

import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


mongoose.connect(`${process.env.DB_CONNECTION}`);
mongoose.connection.once('open', async () => {

    // initialize the issue sheet Number, 

    const counter = await Counter.find();

    if (counter.length < 1) {  // no counter saved.
        const newCounter = new Counter({});
        newCounter.save();
    }
    console.log('Connected to IssueSheet database');
}).on('error', (error) => {
    console.log('connection error ', error);
});


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors("*"));

// routes
app.use('/register', registerRoutes)
app.use('/categories', categoryRoutes);
app.use('/issue-sheets', issueSheetRoutes)
app.use('/users', userRoutes)

app.use(express.static(path.join(__dirname, 'dist')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});





app.listen(PORT, () => {
    console.log(`server started at port ${PORT}`)
    swaggerDocs(app, PORT)
})

