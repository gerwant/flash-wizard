$('.ui.dropdown').dropdown();


electron.ipcRenderer.on('port-list-reply', function (event, args) {

    let container = $('#ports');
    container.html("")
    if(args.length===0){
        $('.port-dropdown-label').html(i18n.__("No ports"))
        electron.ipcRenderer.send('send-config-request', null, "port");
    } else {
        $('.port-dropdown-label').html("Port")
        args.forEach((element)=>{
            let li = document.createElement('div')
            li.className = "port item"
            li.innerHTML = element.path
            container.append(li)
        })
    }
    $('.port').click(function(){
        electron.ipcRenderer.send('send-config-request', this.innerHTML, "port");
        stepTransition(2)
    })
});

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