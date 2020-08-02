$('input[type="file"]').change((event)=>{
    const file = event.target.files[0];
    console.log(file); // TODO: Pass new file to backend
})