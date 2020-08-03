

$('input[type="file"]').change((event)=>{
    const file = event.target.files[0];
    // console.log(file); 
    electron.ipcRenderer.send('send-config-request', file.path, "file_path");
    $('.second-step-1').show("slide", {direction: "right"})
})

$('.flash-firmware-btn').click(()=>{
    console.log('Flash fired')
    document.getElementsByClassName('avrdude_output')[0].innerHTML = '';
    electron.ipcRenderer.send('perform-flash', null)
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