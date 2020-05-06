'use strict'

const mongoose = require('mongoose');

(async () => {
    console.log(process.env.DB_URL);
    try {
        await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected successfully');
    } catch (err) {
        console.error('Connection failed: ', err);
    }
})();

module.exports = mongoose.connection;