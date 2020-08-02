const electron = require('electron')





$('.choose-port').click(function(){
   
    electron.ipcRenderer.send('port-list-request');
})



electron.ipcRenderer.on('port-list-reply', function (event, args) {
    console.log("dosatalem liste", args)
});