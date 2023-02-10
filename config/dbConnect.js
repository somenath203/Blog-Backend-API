const mongoose = require('mongoose');


mongoose.set('strictQuery', true);


const dbConnect = async () => {

    try {
        
        await mongoose.connect(process.env.MONGO_URI);

        console.log('connection to mongoDB successful');

    } catch (error) {

        console.log(error.message);

        process.exit(1);
        
    }

};


dbConnect();



