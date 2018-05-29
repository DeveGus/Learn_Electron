const electron = require('electron');
const path = require('path');
const url = require('url');
const Excel = require('exceljs');

const {app, BrowserWindow, Menu, ipcMain} = electron;

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

var rawDataWorkbook = new Excel.Workbook();

// function table(){timestampCol
//   this.timestampCol
//   this.
//   this.
// }

ipcMain.on('input:readExcel',function(e){
    e.preventDefault()
    rawDataWorkbook.xlsx.readFile('rawData.xlsx').then(function() {
        var rawData = rawDataWorkbook.getWorksheet(1)
        var timestampCol = rawData.getColumn(1).values
        var statusCol  = rawData.getColumn(2).values
        var valueCol = rawData.getColumn(3).values
        var dataTable = []
        var i = 2
        console.log(timestampCol[i], statusCol[i], valueCol[i])
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
