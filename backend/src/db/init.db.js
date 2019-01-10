const excelHook = require('../services/csv.service');

// Initalizing the Process Memory Cache
const init = async () => {
    // calling the Excel Read Service
    return await excelHook.readExcel();
}

module.exports = {
    init
}