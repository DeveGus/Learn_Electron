const electron = require('electron');
const path = require('path');
const url = require('url');
const Excel = require('exceljs');
const dialog = require('electron').dialog;

const {app, BrowserWindow, Menu, ipcMain} = electron;

var rawDataPath

let mainWindow

app.on('ready',function(){
    mainWindow = new BrowserWindow({show: false, backgroundColor: '#002B36'})
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'mainWindow.html'),
      protocol: 'file',
      slashes: true
    }));
    mainWindow.on('ready-to-show', () => {
      mainWindow.show();
    });

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu)
  });

const mainMenuTemplate = [
  {
    label:'File',
    submenu:[
      {
        label: 'Quit',
        accelerator: process.platform == 'darwin' ? 'Command+Q' :
        'Ctrl+Q',
        click(){
          app.quit();
        }
      }
    ]
  }
];

process.on('uncaughtException', function (error) {
  // console.log(error.message);
    switch (error.message) {
      case "Cannot read property '0' of undefined":
        console.log('error path not valid');
        break;
      default:
    };
});

//catch input:sum
ipcMain.on('input:sum',function(e,inputArray){
  const sum = inputArray.reduce(function(acc, val) {return acc + val; });
  mainWindow.webContents.send('input:sum',sum)
});
// catch load:newPage
ipcMain.on('load:newPage',function(e,newWin){
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, newWin),
    protocol: 'file',
    slashes: true
  }));
});

//Catch inputFile:path, open a browse window in the local file sustem to choose the raw data .xlsx file
ipcMain.on('inputFile:path',function(e,excelPath){
    e.preventDefault();
    rawDataPath = dialog.showOpenDialog({
        filters: [{ name: 'Excel', extensions: ['xlsx'] },
                  { name: 'All Files', extensions: ['*'] }],
        properties: ['openFile']
      })[0];
});
// catch input:readExcel, read excelPath file
var rawDataWorkbook = new Excel.Workbook();
ipcMain.on('input:readExcel',function(e){
    e.preventDefault()
    rawDataWorkbook.xlsx.readFile(rawDataPath).then(function() {
        var rawData = rawDataWorkbook.getWorksheet(1)
        console.log(rawData.getRow(2).values);
        var timestampCol = rawData.getColumn(1).values
        var statusCol  = rawData.getColumn(2).values
        var valueCol = rawData.getColumn(3).values
        var dataTable = []
        var i = 2
        statusCol.forEach(function(row){;
          if (row == 'M') {
            dataTable.push([timestampCol[i], statusCol[i], valueCol[i]]);
            }
          i++;
          });

      });
  });


if(process.env.NODE_ENV !== 'production'){
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu:[
      {
        label: 'Toogle DevTools',
        accelerator: process.platform == 'darwin' ? 'Command+I' :
        'Ctrl+I',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      }
    ]
  });
}
