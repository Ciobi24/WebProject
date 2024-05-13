const mongoose = require('mongoose');

const uri = "mongodb+srv://infoX:tehnologii-web2024@informatixdb.hw325xp.mongodb.net/?retryWrites=true&w=majority&appName=informatixDB";

async function connect() {
    try {
        await mongoose.connect(uri);
        console.log("Connected to DB.");

        await mongoose.connection.createCollection("users");

    } catch (error) {
        console.error("Error connecting to DB: " + error);
    }
}
connect();
