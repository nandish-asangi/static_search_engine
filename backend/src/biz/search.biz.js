/*
Class SearchBiz
Description: Handles the search request and updates the cache memory
*/
class SearchBiz {

    // Constructor with data initialization
    // this.q = queryText: Query Term
    // this.dbDictionary: Static Search Data
    // this.dbDictionaryRecord: Associated Recordfor search data
    constructor(queryText, dbDictionary, dbDictionaryRecord){
        this.q = queryText;
        this.dbDictionary = dbDictionary;
        this.dbDictionaryRecord = dbDictionaryRecord;
    }


    // Method to handle the search request
    // rankingScore: Current static rankingScore memory data
    async processSearchRequest(rankingScore) {

        return new Promise(async (resolve, reject) => {
            try{
                let _this = this;

                // Building the reex pattern with search key, eventually returns multiple match patterns in groups, 
                // not only the matched part but entire word associated with the match
                let pattern = new RegExp ('\\b(\\w*' + this.q + '\\w*)\\b', 'igm');

                // Getting all matched records
                let matchedArray = _this.dbDictionary.match(pattern)

                // Restructing the matched records to sort them in 
                // - Results that start with the query term must be given a priority
                // - The shortest (in length) result is preferred
                const sortedResult = await _this.processSortingOrder(matchedArray);

                // Assinging records to each result value and also updating the current ranking score record set with new rank sets
                const {sortedResultSet, rankingScoreSet} = await _this.processRankingOrder(sortedResult, rankingScore);

                // Returning by resolving the Results and Ranking Sets
                resolve({sortedResultSet, rankingScoreSet});
            }catch(error){
                // Exception handling, by just reject the error which will eventually hit exception block in global scope
                reject(error)
            }
        });
    }


    // Method to handle 
    // - Results that start with the query term must be given a priority
    // - The shortest (in length) result is preferred
    // searchResult: Consists of all the matched records either which start from begining or somewhere in the text
    async processSortingOrder(searchResult) {

        // Checking if result exists or empty
        if(searchResult){
            // Seperating the results that start with the query
            let startWordSet = searchResult.filter((str) => {
                if(str.startsWith(this.q)) return str;
            });

            // Rearranging the seprated result set in ascending order position of the result according to their length in characters number
            startWordSet.sort(function(a,b){
                return a.length - b.length;
            });
            
            // Seperating the results that do not start with the query
            let nStartWordSet = searchResult.filter((str) => {
                if(!str.startsWith(this.q)) return str;
            });
            
            // Rearranging the seprated result set in ascending order position of the result according to their length in characters number
            nStartWordSet.sort(function(a,b){
                return a.length - b.length;
            });
            
            // Merging the 2 results, eventually keeps startsWith results on the top and remaining in the below of the list
            return startWordSet.concat(nStartWordSet);
        }
        // Returning empty records in case of result list empty found
        return searchResult;
    }

    // Method to handle
    // - Assings each result with the associcated ranks and also updates the ranking set
    async processRankingOrder(sortedResult, rankingScoreSet) {

        let _this = this;
        let sortedResultSet = {};

        // Checking for the result list exists, or not empty
        if(sortedResult){
            sortedResult.map(async (str) => {
                // Updating the ranking set
                if(!rankingScoreSet[str]){
                    rankingScoreSet[str] = 1
                }else{
                    rankingScoreSet[str]++
                }

                // Attached the record set
                sortedResultSet[str] = await _this.attachRecordSet(str, rankingScoreSet[str]);
            });
        }

        // Returning the SortedResultSet and updated RankingSet
        return {sortedResultSet, rankingScoreSet}
    }

    // Method to return the record set of the term matched from the global record set process memory
    async attachRecordSet(key, score) {
        let _this = this;
        return {score, middleName: _this.dbDictionaryRecord[key].middleName, surName: _this.dbDictionaryRecord[key].middleName};
    }
}

module.exports = SearchBiz;