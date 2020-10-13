const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectMongoDB = async () => {
    try {
        await mongoose.connect(db, 
        {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });

        console.log('MongoDB Atlas conectado');
    } catch(err){
        console.error(err.message);
        process.exit(1);
    }
}

module.exports = connectMongoDB;