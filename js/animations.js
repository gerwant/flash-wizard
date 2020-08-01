$('.top-half').click(function(){
    $('.first-step-1').hide()
    $('.second-step-1').hide()
    $('.third-step-1').hide()
    $('.middle-segment-2').hide();
    $(this).animate({height:'100px'});
    $('.bottom-half').animate({height: '100px'}, 500, function(){
       $('.middle-segment-1').show(0).animate({height: ($(window).height()-200).toString()},0, function(){
            $('.first-step-1').show("slide")
       });
    });

    //$('.middle-segment-1').show(0).animate({height: ($(window).height()-200).toString()},0,function(){
    //});
})

$('.choose-file').click(function(){
    $('.second-step-1').show("slide", {direction: "right"})
})

$('.choose-port').click(function(){
    $('.third-step-1').show("slide", {direction: "right"})
})

$('.bottom-half').click(function(){
    $(this).animate({height:'100px'});
    $('.top-half').animate({height: '100px'});
    $('.middle-segment-1').hide();
    $('.middle-segment-2').show(0).animate({height: ($(window).height()-200).toString()},0)
})