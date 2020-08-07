$('.middle-segment-1').hide();

$('.top-half').click(function(){
    //blur stuff
    $(this).attr("isselected", "true")
    $('.bottom-half').attr("isselected","false")
    $('.top-half-label').css({"filter": "none"});
    $('.bottom-half-label').css({"filter": "blur(10px)"});

    $('.language-dropdown').hide()
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


$('.top-half').mouseover(function(){
    $('.top-half-label').css({"filter": "none"});
})
$('.bottom-half').mouseover(function(){
    $('.bottom-half-label').css({"filter": "none"});
})
$('.top-half').mouseout(function(){
    if($(this).attr("isselected")==="false")
        $('.top-half-label').css({"filter": "blur(10px)"})   
})
$('.bottom-half').mouseout(function(){
    if($(this).attr("isselected")==="false")
        $('.bottom-half-label').css({"filter": "blur(10px)"}) 
})


// $('.choose-file').click(function(){
//     $('.second-step-1').show("slide", {direction: "right"})
// })

$('.bottom-half').click(function(){
    //blur stuff
    $(this).attr("isselected", "true")
    $('.top-half').attr("isselected","false")
    $('.bottom-half-label').css({"filter": "none"});
    $('.top-half-label').css({"filter": "blur(10px)"});

    $('.language-dropdown').hide()
    $('.first-step').hide()
    $('.second-step').hide()
    $('.third-step').hide()
    $(this).animate({height:'100px'});
    $('.middle-segment-1').hide();

    $('.top-half').animate({height: '100px'}, 500, function(){
        $('.middle-segment-2').show(0).animate({height: ($(window).height()-200).toString()},0, function(){
             $('.first-step-2').show("slide")
        });
     });

})

$('.flag').click(function(){
    $('.chosen-flag').removeClass("chosen-flag")
    $(this).addClass("chosen-flag")
})
