
$('.ui.dropdown').dropdown();



$('.confirm-config-btn').click(function(){
    $('.second-step-2').show("slide", {direction: "right"})
    electron.ipcRenderer.send('port-list-request');
})
$('.refresh-ports').click(function(){
   
    electron.ipcRenderer.send('port-list-request');
})

electron.ipcRenderer.on('dropdown-content', (event, args) => {
    let dropdown = $("#"+args.dropdown);
    _.each(args.content, (element) => {
        let div = document.createElement('div')
        div.className = "item processor-item"
        div.innerHTML = element
        dropdown.append(div)
    })
})


electron.ipcRenderer.on('port-list-reply', function (event, args) {

    let container = $('#ports2');
    container.html("")
    if(args.length===0){
        $('.port-dropdown-label').html(i18n.__("No ports"))
        electron.ipcRenderer.send('send-port-request', null);
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
        electron.ipcRenderer.send('send-port-request', this.innerHTML);
        $('.third-step-2').show("slide", {direction: "right"})
    })
});