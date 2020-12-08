const fs = require('fs')
const path = require('path')
const { remote } = require('electron')
let app = remote.app

$(document).ready(function(){
    let lanugage = i18n.getLanguage()
    $(`.${lanugage}.flag`).addClass("chosen-flag")
    $('.error-modal').modal({
        onHide: function(){
            electron.ipcRenderer.send('reload');
        }
    }
    )
    $('img').on('dragstart', function(event) { event.preventDefault(); });
})

function cutlabel(label, btn){
    
    if(label.length>16){
        $(`.${btn}-label`).text(label.slice(0, 15)+'...')
        $(`.${btn}`).attr('data-tooltip', label)
    }
    else{
        
        $(`.${btn}-label`).text(label)
        $(`.${btn}`).removeAttr('data-tooltip')
    }
}

$('input[type="file"]').change((event)=>{
    const file = event.target.files[0];
    // console.log(file); 
    electron.ipcRenderer.send('send-config-request', file.path, "file_path");

    cutlabel(file.name, 'choose-file')

    
    stepTransition(3)
   
})

$('.flash-firmware-btn').click(()=>{
    console.log('Flash fired')
    
    document.getElementsByClassName('avrdude_output')[0].innerHTML = '';
    $('.bolt.icon').hide()
    $('.flash-firmware-btn').hide()
    $('.kill-avr-btn').show()
    $('.flash-progress').show("fade",()=>{
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

$('.paypal-redir').click(()=>{
    $('.donate-modal').modal('hide');
    electron.shell.openExternal('https://paypal.me/helpgmz');
})

$('.close.icon').click(() => 
    $('.donate-modal').modal('hide')
)

electron.ipcRenderer.on('update-download-progress', (event, data) => {
    $('.close-update-win').hide();
})

electron.ipcRenderer.on('hex-downloaded', (event) =>{
    
    stepTransition(2)
    $('.flash-progress-download').hide()
    $('.file.icon').show()
   
})

electron.ipcRenderer.on('avrdude-response', (event, data)=>{
    console.log('Data received');
    document.getElementsByClassName('avrdude_output')[0].innerHTML += data;
    let textarea = $('.avrdude_output')
    textarea.scrollTop(textarea[0].scrollHeight)
})

electron.ipcRenderer.on('avrdude-done', (event, data)=>{
    let hex_path = isDev? path.join(__dirname, '../../') : app.getPath("userData")
    $('.kill-avr-btn').hide()
    $('.flash-firmware-btn').show()
    
    fs.unlink(path.join(hex_path, "firmware.hex"), function(err) {
        if(err && err.code == 'ENOENT') {
            // file doens't exist
            console.info("File doesn't exist, won't remove it.");
        } else if (err) {
            // other errors, e.g. maybe we don't have enough permission
            console.error("Error occurred while trying to remove file");
        } else {
            console.info(`removed`);
        }
    });
    console.log('Flashing done.')
    $('.flash-progress').hide()
    $('.bolt.icon').show()
    $('.flash-firmware-btn').removeClass("inactive-btn")
    $('.flash-firmware-btn').addClass("active-btn")
    $('.flash-firmware-btn').removeClass("disabled")
    document.getElementsByClassName('avrdude_output')[0].innerHTML += data;
    let textarea = $('.avrdude_output')
    textarea.scrollTop(textarea[0].scrollHeight)

    if(data!="Flashing aborted"){
        $('.donate-modal').modal('show');
    }

})

electron.ipcRenderer.on('wizard-assistant-error', (event)=>{
    $('.error-modal').modal("show")
})

$('.language-item').click(function(){
    
    electron.ipcRenderer.send('change-language-request', $(this).attr("val"));
})
$('.flag').not('.desibled-flag').click(function(){
    electron.ipcRenderer.send('change-language-request', $(this).attr("val"));
    select_flag(this)
})



$('.close-update-win').click( () => {
    electron.ipcRenderer.send('close-update-win');
})

$('.download-update').click( () => {
    document.getElementsByClassName('download-update')[0].innerHTML = '<div class="ui active inline mini inverted loader"></div>'
    document.getElementsByClassName('close-update-win')[0].disabled = true;
    electron.ipcRenderer.send('download-update');
})

$('.main-website-redir').click(()=>{
    electron.shell.openExternal('https://garage-makezone.eu')
})

$('.shop-website-redir').click(()=>{
    electron.shell.openExternal('https://shop.garage-makezone.eu/')
})

$('.help-trigger').click(function(){
    electron.ipcRenderer.send('openHelpWindow');
})

$('.go-back').click(()=> {
    electron.ipcRenderer.send('goToWelcome');
    electron.ipcRenderer.send('kill_avrdude');

})
$('.processor-dropdown').change(function(){
    cutlabel( $('.processor-dropdown-label').text(), "processor-dropdown")
})
$('.sensor-dropdown').change(function(){
    cutlabel( $('.sensor-dropdown-label').text(), "sensor-dropdown")
})
$('.kill-avr-btn').click(function(){
    electron.ipcRenderer.send('kill_avrdude');
})

