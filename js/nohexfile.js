const { ipcRenderer } = require("electron");

$('.ui.dropdown').dropdown();

$('.confirm-config-btn').click(function(){
    electron.ipcRenderer.send('port-list-request');
})
$('.refresh-ports').click(function(){
   
    electron.ipcRenderer.send('port-list-request');
})

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
        stepTransition(3)
    })
});

electron,ipcRenderer.on("language-popup", (event, args) =>{
    
    let files = {}
    $('.modal-flag').css({"filter":  "grayscale(100%)"})
    $(".modal-flag").prop("onclick", null).off("click");
    args.files.forEach((element)=>{
        if(element.charAt(element.length-7) !=='_') return
        let lang = element.slice(-6, -4).toLowerCase()
        $(`.modal-flag.${lang}`).css({"filter": "none"})
        $(`.modal-flag.${lang}`).click(function(){
            electron.ipcRenderer.send('download-hex', element)
            $('.language-modal').modal('hide')
            $('.mini-flag').attr('src', $(`.modal-flag.${lang}`).attr('src')).css({"display": 'block'})
        })
    })
    $(function () {
        $('.language-modal').modal('show');
   });
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
        //electron.ipcRenderer.send('send-config-request', path.join(__dirname, '../firmware.hex'), "file_path")
        electron.ipcRenderer.send('port-list-request');
        console.log('firing update sensor with ', $(this).text())
        electron.ipcRenderer.send('update-sensor', {sensor: $(this).text()})
        $('.file.icon').hide()
        $('.flash-progress-download').show()
    })
})