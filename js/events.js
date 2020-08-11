$(document).ready(function(){
    let lanugage = i18n.getLanguage()
    console.log("langugag", lanugage)
    $(`.${lanugage}`).addClass("chosen-flag")
    if(isDev){
        $('.no-hex-trigger').removeClass("inactive-btn disabled")
        $('.tooltip-wrapper').removeAttr("data-tooltip")
    }
    
})


$('input[type="file"]').change((event)=>{
    const file = event.target.files[0];
    // console.log(file); 
    electron.ipcRenderer.send('send-config-request', file.path, "file_path");


    let name = (file.name.length>10) ? file.name.slice(0, 8)+"..." : file.name
    $('.choose-file-label').text(name)
    $('.choose-file').attr('data-tooltip', file.name)
    
    $('.step3').find('h4').removeClass("active-step-title")
    $('.step3').find('h4').addClass("inactive-step-title")
    $('.step3').find('.step-icon').removeClass("active-icon")
    $('.step3').find('.step-icon').addClass("inactive-icon")
    $('.step3').find('.step-btn').removeClass("active-btn")
    $('.step3').find('.step-btn').addClass("inactive-btn")

    

    $('.step4').find('h4').removeClass("inactive-step-title")
    $('.step4').find('h4').addClass("active-step-title")
    $('.step4').find('.step-icon').removeClass("inactive-icon")
    $('.step4').find('.step-icon').addClass("active-icon")
    $('.step4').find('.step-btn').removeClass("inactive-btn")
    $('.step4').find('.step-btn').addClass("active-btn")
    $('.step4').find('.step-btn').removeClass("disabled")
   
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