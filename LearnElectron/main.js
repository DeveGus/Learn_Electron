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

ipcMain.on('input:readExcel',function(e,inputArray){
var workbook = new Excel.Workbook();
workbook.xlsx.readFile('test.xlsx')
    .then(function() {
        console.log(workbook);
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
