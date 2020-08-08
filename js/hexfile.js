


$('.ui.dropdown').dropdown();



$('.refresh-ports').click(function(){
   
    electron.ipcRenderer.send('port-list-request');
})
$('.processor-item').click(function(){
   
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
        $('.step2').find('h4').removeClass("active-step-title")
        $('.step2').find('h4').addClass("inactive-step-title")
        $('.step2').find('.step-icon').removeClass("active-icon")
        $('.step2').find('.step-icon').addClass("inactive-icon")
        $('.step2').find('.step-btn').removeClass("active-btn")
        $('.step2').find('.step-btn').addClass("inactive-btn")
    
        
    
        $('.step3').find('h4').removeClass("inactive-step-title")
        $('.step3').find('h4').addClass("active-step-title")
        $('.step3').find('.step-icon').removeClass("inactive-icon")
        $('.step3').find('.step-icon').addClass("active-icon")
        $('.step3').find('.step-btn').removeClass("inactive-btn")
        $('.step3').find('.step-btn').addClass("active-btn")
        $('.step3').find('.step-btn').removeClass("disabled")
    })
});


$('.processor-item').click(function(){
    electron.ipcRenderer.send('send-config-request', $(this).data("value"), "processor");
    $('.step1').find('h4').removeClass("active-step-title")
    $('.step1').find('h4').addClass("inactive-step-title")
    $('.step1').find('.step-icon').removeClass("active-icon")
    $('.step1').find('.step-icon').addClass("inactive-icon")
    $('.step1').find('.step-btn').removeClass("active-btn")
    $('.step1').find('.step-btn').addClass("inactive-btn")

    

    $('.step2').find('h4').removeClass("inactive-step-title")
    $('.step2').find('h4').addClass("active-step-title")
    $('.step2').find('.step-icon').removeClass("inactive-icon")
    $('.step2').find('.step-icon').addClass("active-icon")
    $('.step2').find('.step-btn').removeClass("inactive-btn")
    $('.step2').find('.step-btn').addClass("active-btn")
    $('.step2').find('.step-btn').removeClass("disabled")

})

$('.baudrate-item').click(function(){
    electron.ipcRenderer.send('send-config-request', this.innerHTML, "baudrate");
})