window.$ = window.jQuery = require('jquery');
const electron = require('electron');
const {ipcRenderer} = electron;

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

// Browse to raw data file path
const rawDataBrowseBtn = $('#rawDataBrowseBtn')
rawDataBrowseBtn.click(rawDataBrowseFile);
function rawDataBrowseFile(e){
  e.preventDefault()
  console.log('merda');
  ipcRenderer.send('readExcel:rawDataPath')
  }

const pumpsBrowseBtn = $('#pumpsBrowseBtn')
pumpsBrowseBtn.click(pumpsBrowseFile);
function pumpsBrowseFile(e){
    e.preventDefault()
    console.log('pumps');
    ipcRenderer.send('readExcel:pumpsPath')
  }

//Show the excel file path received from main.js
const rawDataPathOutput = $('#rawDataPathOutput');
const pumpsPathOutput = $('#pumpsPathOutput');
ipcRenderer.on('readExcel:rawDataChosenPath', function(e, filePath){
      rawDataPathOutput.val(filePath);
    });
ipcRenderer.on('readExcel:pumpsChosenPath', function(e, filePath){
      pumpsPathOutput.val(filePath);
    });
//Upload file
const rawDataUploadBtn = $('#rawDataUploadBtn');
rawDataUploadBtn.click(readRawDataExcel);
function readRawDataExcel(e){
  e.preventDefault();
  ipcRenderer.send('readExcel:rawData');
};
const pumpsUploadBtn = $('#pumpsUploadBtn');
pumpsUploadBtn.click(pumpsDataExcel);
function pumpsDataExcel(e){
  e.preventDefault();
  pumpsPath =  $('#pumpsPathOutput').value;
  ipcRenderer.send('readExcel:pumps');
};
