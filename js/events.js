

$(document).ready(function(){
    let lanugage = i18n.getLanguage()
    console.log("langugag", lanugage)
    $(`.${lanugage}`).addClass("chosen-flag")
})


$('input[type="file"]').change((event)=>{
    const file = event.target.files[0];
    // console.log(file); 
    electron.ipcRenderer.send('send-config-request', file.path, "file_path");
    $('.second-step-1').show("slide", {direction: "right"})

    let name = (file.name.length>10) ? file.name.slice(0, 8)+"..." : file.name
    $('.choose-file-label').text(name)
    $('.choose-file').attr('data-tooltip', file.name)
   
})

$('.flash-firmware-btn').click(()=>{
    console.log('Flash fired')
    document.getElementsByClassName('avrdude_output')[0].innerHTML = '';
    $('.flash-progress').show("fade",()=>{
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