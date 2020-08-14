
$('.ui.dropdown').dropdown();

$('.confirm-config-btn').click(function(){
    electron.ipcRenderer.send('port-list-request');
})
$('.refresh-ports').click(function(){
   
    electron.ipcRenderer.send('port-list-request');
})

electron.ipcRenderer.on('dropdown-content', (event, args) => {
    let dropdown = $("#"+args.dropdown);
    dropdown.html("")
    _.each(args.content, (element) => {
        let div = document.createElement('div')
        div.className = "item "
        div.className += (args.dropdown=="processors") ? "processor-item" : "sensor";
        div.innerHTML = element
        dropdown.append(div)
    })
    $('.processor-item').click(function(){
        console.log($(this).text())
        $('.sensor-dropdown-label').html("Sensor")
        electron.ipcRenderer.send('sensors-list-request', {device: $(this).text()});
        stepTransition(1)
    })
    $('.sensor').click(function(){
        electron.ipcRenderer.send('port-list-request');
        stepTransition(2)
    })
})