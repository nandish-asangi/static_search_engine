const app = new require('express')();
const config = require('config')
const portNumber = process.env.PORT_NO || config.get('app.port');
var cors = require('cors')

// Middleware for Cross Origin Remote Servers Communication
app.use(cors())


// API layer and business layer map controllers
var searchController = require("./src/controllers/search.controller");


// Initializing static process in memory cache with excel data
try{
    searchController.initProcess();
}catch(error){
    console.log(error)
}


// Routes
app.get("/", searchController.home);
app.get("/search", searchController.processSearch);


// Global error handling block
app.use((err, req, res, next) => {
    console.log(err);
    const isDebugEnabled = (config.get("app.debug") == 1);
    let result = {
        success: false,
        error: isDebugEnabled ? err.message : "Internal Server Error",
        stack: isDebugEnabled ? err.stack : "",
        data: {}
    };
    res.status(500).send(result);
});


// Global unhandled rejection block
process.on('unhandledRejection', error => {
    console.log(error);
});


// Assinging server to a port
app.listen(portNumber, () => {
    console.log(`Service Started: ${portNumber}`)
});


// Exporting module app
module.exports = app;