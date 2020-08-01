$('.top-half').click(function(){
    console.log('jazda');
    $(this).animate({height:'100px'});
    $('.bottom-half').animate({height: '100px'})
})