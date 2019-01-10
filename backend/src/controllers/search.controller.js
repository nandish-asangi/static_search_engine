const config = require('config');
const SearchBiz = require('../biz/search.biz');
const DB = require('../db/init.db');


// Static Cache Data Holder
let dbDictionary = [];
let dbDictionaryRecord = [];
let rankingScore = {};


// Basic Home Controller Block
exports.home = (request, response) => {
    response.setHeader('Content-Type', 'application/json');
    let portNumber = config.get('app.port').toString();
    response.status(200).send(JSON.stringify({status: "Service is running", portNumber}));
};


// Init Controller Block
exports.initProcess = async (next) => {
    try {
        dbDictionaryRecord = await DB.init()
        dbDictionary = Object.keys(dbDictionaryRecord).join(' ')
    } catch (error) {
        next(error);
    }
};


// BSearch Controller Block
exports.processSearch = async (request, response, next) => {

    // Setting up response header
    response.setHeader('Content-Type', 'application/json');

    // Validating Params
    if(request.query.q == undefined || request.query.q.length <= 2) {
        return response.send({success: false, error:"Query String Missing !!", data: {}});
    }

    try {
        // Validating cache memory availabity
        if(!dbDictionary.length){
            return response.send({success: false, error:"Dictionary Initializing Failed !!", data: {}});
        }

        const queryText = request.query.q;

        // Instanstiating and updating the class object with static data via constructor
        const searchBizObj = new SearchBiz(queryText, dbDictionary, dbDictionaryRecord);

        // Process the search request
        const {sortedResultSet, rankingScoreSet} = await searchBizObj.processSearchRequest(rankingScore);

        // Updating the latest ranking score to process memory cache
        rankingScore = rankingScoreSet

        // Returning the response
        response.status(200).send(JSON.stringify({success:true, data: sortedResultSet, error: false}))
    } catch (error) {
        next(error);
    }
};