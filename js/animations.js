$('.top-half').click(function(){
    $(this).animate({height:'100px'});
    $('.bottom-half').animate({height: '100px'});
    $('.middle-segment-1').show(0).animate({height: ($(window).height()-200).toString()},0);
    $('.middle-segment-2').hide();
})

$('.bottom-half').click(function(){
    $(this).animate({height:'100px'});
    $('.top-half').animate({height: '100px'});
    $('.middle-segment-1').hide();
    $('.middle-segment-2').show(0).animate({height: ($(window).height()-200).toString()},0)
})