

$('input[type="file"]').change((event)=>{
    const file = event.target.files[0];
    // console.log(file); 
    electron.ipcRenderer.send('send-file-request', file.path);
    $('.second-step-1').show("slide", {direction: "right"})
})