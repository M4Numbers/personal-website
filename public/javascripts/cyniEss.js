var page_top = true;
var loaded = 1;

var bumpIt = function() {
        $('body').css('margin-bottom', $('.big_footer').height());
    },
    didResize = false;

//window.onload = function() {
//    bumpIt();
//};

window.onscroll = function() {
    if (document.body.scrollTop > 50 && page_top)
    {
        page_top = false;
        spinDial();
    }
    else if (document.body.scrollTop < 50 && !page_top)
    {
        page_top = true;
        resetDial();
    }
};

function spinDial() {
    $('#dial').animate({rotate: '180deg'}, 900);
}

function resetDial() {
    $('#dial').animate({rotate: '0deg'}, 900);
}

function toTheTop() {
    $('html, body').animate({ scrollTop: 0}, 'slow');
    top = true;
    resetDial();
}

function loadComment(item_id, result_field)
{
    $.get('/scripts/load_comments.php', {item_id: item_id},
        function updateComments(response) {
            $(result_field).val(JSON.parse(response).comments);
        }
    );
}

$(window).resize(function() {
    didResize = true;
});

//setInterval(function() {
//    if(didResize) {
//        didResize = false;
//        bumpIt();
//    }
//}, 250);

function toggleMenu() {
    document.getElementById("showLeftPush").classList.toggle("active");
    document.getElementById("showLeftPush").classList.toggle("cbs-spmenu-push-toright");
    document.body.classList.toggle("cbp-spmenu-push-toright");
    document.getElementById("cbp-spmenu-s1").classList.toggle("cbp-spmenu-open");
}
