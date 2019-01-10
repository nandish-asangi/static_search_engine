var fs = require('fs')
var csv = require('fast-csv')
const config = require('config');
var stream = fs.createReadStream(__dirname + "/../" + config.get("excel_filename"));

var parsedData = [];


// Method refernece to read the excel sheet
const readExcel = () => {
    return new Promise((resolve, reject) => {
         try {
            // Feading the data from CSV and rearraging it the recordset
            csv.fromStream(stream, {headers : ["givenName", "middleName", "surname"]}).on("data", function(data){
                parsedData[data.givenName] = {middleName: data.middleName, surName: data.surname};
            }).on("end", function(){
                delete parsedData.givenName;
                return resolve(parsedData);
             });
        } catch (error) {
            reject(error)
        }
    });
}

module.exports = {
    readExcel
};