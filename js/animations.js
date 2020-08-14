//step = id of step you are leaving
function stepTransition(step){

    if($(`.step${step}`).attr("done") === "false"){
        $(`.step${step}`).find('h4').removeClass("active-step-title")
        $(`.step${step}`).find('h4').addClass("inactive-step-title")
        $(`.step${step}`).find('.step-icon').removeClass("active-icon")
        $(`.step${step}`).find('.step-icon').addClass("inactive-icon")
        $(`.step${step}`).find('.step-btn').removeClass("active-btn")
        $(`.step${step}`).find('.step-btn').addClass("inactive-btn")

        

        $(`.step${step + 1}`).find('h4').removeClass("inactive-step-title")
        $(`.step${step + 1}`).find('h4').addClass("active-step-title")
        $(`.step${step + 1}`).find('.step-icon').removeClass("inactive-icon")
        $(`.step${step + 1}`).find('.step-icon').addClass("active-icon")
        $(`.step${step + 1}`).find('.step-btn').removeClass("inactive-btn")
        $(`.step${step + 1}`).find('.step-btn').addClass("active-btn")
        $(`.step${step + 1}`).find('.step-btn').removeClass("disabled")
        $(`.step${step}`).attr("done", "true")
    }
}

$('.flag').click(function(){
    $('.chosen-flag').removeClass("chosen-flag")
    $(this).addClass("chosen-flag")
})

$('.flash-firmware-btn').click(function(){
    $('.avrdude_output_wrapper').show("fade")
})

