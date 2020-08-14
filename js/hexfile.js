$('.ui.dropdown').dropdown();



$('.refresh-ports').click(function(){
   
    electron.ipcRenderer.send('port-list-request');
})

$('.processor-item').click(function(){
   
    electron.ipcRenderer.send('port-list-request');
})

$('.processor-item').click(function(){
    electron.ipcRenderer.send('send-config-request', $(this).data("value"), "processor");
    stepTransition(1)
})

$('.baudrate-item').click(function(){
    electron.ipcRenderer.send('send-config-request', this.innerHTML, "baudrate");
})