window.$ = window.jQuery = require('jquery');
const electron = require('electron');
const {ipcRenderer} = electron;

//--------- HEADER



//------- MAIN WINDOW
//Submit data in the form
const form = $('#myForm');
form.submit(submitForm);
//Send a msg to main.js
function submitForm(e) {
  e.preventDefault();
  const inputForm = $('input[name^=inputData]');
  inputArray = inputForm.map(function(idx, elem) {
    return parseFloat($(elem).val());
    }).get();
  ipcRenderer.send('input:sum', inputArray);
}
//Show the excel file path received from main.js
ipcRenderer.on('inputFile:choosePath', function(e, rawDataPath){
    var parseArray = rawDataPath.split("");
    console.log(parseArray);
    $('#resultInputFile').text(rawDataPath);
});


const inputFileBtn = $('#inputFileBtn')
inputFileBtn.click(browseInputFile);
function browseInputFile(e){
  e.preventDefault()
  ipcRenderer.send('inputFile:path')
}
const readExcelBtn = $('#excelBtn');
readExcelBtn.click(readExcel);
function readExcel(e){
  e.preventDefault();
  ipcRenderer.send('input:readExcel');
};
