$(document).ready(function(){
    let lanugage = i18n.getLanguage()
    console.log("langugag", lanugage)
    $(`.${lanugage}`).addClass("chosen-flag")
        $('.no-hex-trigger').removeClass("inactive-btn disabled")
        $('.tooltip-wrapper').removeAttr("data-tooltip")
    
})


$('input[type="file"]').change((event)=>{
    const file = event.target.files[0];
    // console.log(file); 
    electron.ipcRenderer.send('send-config-request', file.path, "file_path");


    let name = (file.name.length>10) ? file.name.slice(0, 8)+"..." : file.name
    $('.choose-file-label').text(name)
    $('.choose-file').attr('data-tooltip', file.name)
    
    stepTransition(3)
   
})

$('.flash-firmware-btn').click(()=>{
    console.log('Flash fired')
    document.getElementsByClassName('avrdude_output')[0].innerHTML = '';
    $('.bolt.icon').hide()
    $('.flash-progress').show("fade",()=>{
        $('.flash-firmware-btn').removeClass('active-btn')
        $('.flash-firmware-btn').addClass("inactive-btn")
        $('.flash-firmware-btn').addClass("disabled")
        electron.ipcRenderer.send('perform-flash', null)
    });
})

// Prevent editing in avrdude output console.
$('.avrdude_output').keyup(function(event){
    event.preventDefault();
});

$('.avrdude_output').keydown(function(event){
    event.preventDefault();
});

electron.ipcRenderer.on('avrdude-response', (event, data)=>{
    console.log('Data received');
    document.getElementsByClassName('avrdude_output')[0].innerHTML += data;
    let textarea = $('.avrdude_output')
    textarea.scrollTop(textarea[0].scrollHeight)
})

electron.ipcRenderer.on('avrdude-done', (event, data)=>{
    console.log('Flashing done.')
    $('.flash-progress').hide()
    $('.bolt.icon').show()
    $('.flash-firmware-btn').removeClass("inactive-btn")
    $('.flash-firmware-btn').addClass("active-btn")
    $('.flash-firmware-btn').removeClass("disabled")
    document.getElementsByClassName('avrdude_output')[0].innerHTML += data;
    let textarea = $('.avrdude_output')
    textarea.scrollTop(textarea[0].scrollHeight)
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

$('.language-item').click(function(){
    
    electron.ipcRenderer.send('change-language-request', $(this).attr("val"));
})
$('.flag').click(function(){
    electron.ipcRenderer.send('change-language-request', $(this).attr("val"));
})

$('.main-website-redir').click(()=>{
    electron.shell.openExternal('https://garage-makezone.eu')
})
$('.help-trigger').click(function(){
    electron.ipcRenderer.send('openHelpWindow');
})
$('.go-back').click(()=> {
    electron.ipcRenderer.send('goToWelcome');
})