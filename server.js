require('dotenv').config();
const express = require('express');

require('./config/dbConnect');

const userRouter = require('./routes/users/userRoutes');
const postRoutes = require('./routes/posts/postRoutes');
const commentRoutes = require('./routes/comments/commentRoutes');
const categoryRoutes = require('./routes/categories/categoryRoutes');


const globalErrorHandler = require('./middlewares/global-error-handler');


const app = express();


app.get('/', (req, res) => {

    res.status(200).send({
        success: true,
        message: 'server is up and running succesfully'
    });
    
});

// MIDDLEWARES
app.use(express.json());


// ROUTES

// 01) user routes
app.use('/api/v1/users', userRouter);

// 02) posts routes
app.use('/api/v1/posts', postRoutes);

// 03) comments routes
app.use('/api/v1/comments', commentRoutes);

// 04) category routes
app.use('/api/v1/categories', categoryRoutes);



// ERROR HANDLER MIDDLEWARES

app.use(globalErrorHandler);

app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `entered url: ${req.originalUrl} not found`
    });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`server running on PORT ${PORT}...`);
}); 