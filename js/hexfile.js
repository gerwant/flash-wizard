const electron = require('electron')

$('.ui.dropdown').dropdown();



$('.choose-port').click(function(){
   
    electron.ipcRenderer.send('port-list-request');
})
$('.choose-file').click(function(){
   
    electron.ipcRenderer.send('port-list-request');
})



electron.ipcRenderer.on('port-list-reply', function (event, args) {
    //let container = document.getElementsByClassName('port-container').item(0)
    
    //container.innerHTML = ""
    //if(args.length === 0){
    //    
    //    let alert = document.createElement('div')
    //    alert.innerHTML = "Brak dostępnych portów"
    //    container.appendChild(alert)
    //}
    //let ul = document.createElement('div')
    //ul.className = "ui middle aligned selection list portlist"
    //args.forEach(element => {
    //    let li = document.createElement('div')
    //    li.className = "item port"
    //    li.innerHTML = element.path
    //    ul.appendChild(li)
    //});
    //container.appendChild(ul)

    let container = $('#ports');

    if(args.length===0){
        let alert = document.createElement('div')
        alert.innerHTML = "Brak dostępnych portów"
        $('.port-container').appendChild(alert)
    } else {
        args.forEach((element)=>{
            let li = document.createElement('div')
            li.className = "port item"
            li.innerHTML = element.path
            container.append(li)
        })
    }

    $('.port').click(function(){
        $('.third-step-1').show("slide", {direction: "right"})
    })
});