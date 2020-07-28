'use strict'
$('.hidden').hide();
$('.update').on('click',function(){
    $(this).next().toggle();
})