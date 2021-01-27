const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/calculadora', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
.then(() => console.log("Succesfully conected to ddbb"))
.catch(console.error)