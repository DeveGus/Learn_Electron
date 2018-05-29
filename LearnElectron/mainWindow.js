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
//Show the value received from main.js
ipcRenderer.on('input:sum', function(e, sum){
    $('input[name^=result]').val(sum);
});

const readExcelBtn = $('#excelBtn');
readExcelBtn.click(readExcel);

function readExcel(e){
  e.preventDefault();
  // const pathInput = $('#pathInput');
  // var path = pathInput.val();
  ipcRenderer.send('input:readExcel');
};
