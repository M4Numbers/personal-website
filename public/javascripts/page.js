const toTheTop = () => {
    $("html, body").animate({scrollTop: 0}, "slow");
};

const goto = (id) => {
    $("html, body").animate(
        {
            scrollTop: $(id).offset().top
        }, "slow");
};

const toggleMenu = () => {
    document.getElementById("showLeftPush").classList.toggle("active");
    document.getElementById("showLeftPush").classList.toggle("cbp-spmenu-button-push-toleft");
    document.body.classList.toggle("cbp-spmenu-push-toleft");
    document.getElementById("cbp-spmenu-s1").classList.toggle("cbp-spmenu-open");
};
