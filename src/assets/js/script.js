// Preloader //
$(window).on('load', function() {
    $(".preloader").fadeOut("slow");

});


jQuery(function($) {


    // Navbar Scroll Function
    var $window = $(window);
    $window.scroll(function() {
        var $scroll = $window.scrollTop();
        var $navbar = $(".navbar");
        if (!$navbar.hasClass("sticky-bottom")) {
            if ($scroll > 200) {
                $navbar.addClass("fixed-menu");
            } else {
                $navbar.removeClass("fixed-menu");
            }
        }
    });

    /*bottom menu fix*/
    if ($("nav.navbar").hasClass("sticky-bottom")) {
        var navHeight = $(".sticky-bottom").offset().top;
        $(window).scroll(function() {
            if ($(window).scrollTop() > navHeight) {
                $('.sticky-bottom').addClass('fixed-menu');
            } else {
                $('.sticky-bottom').removeClass('fixed-menu');
            }
        });
    }



    // Click Scroll Function
    $(".scroll").on('click', function(event) {
        event.preventDefault();
        $("html,body").animate({
            scrollTop: $(this.hash).offset().top
        }, 1000);
    });


    $("body").append("<a href='#' class='back-top'><i class='fa fa-angle-up'></i></a>");
    var amountScrolled = 700;
    var backBtn = $("a.back-top");
    $(window).on("scroll", function() {
        if ($(window).scrollTop() > amountScrolled) {
            backBtn.addClass("back-top-visible");
        } else {
            backBtn.removeClass("back-top-visible");
        }
    });
    backBtn.on("click", function() {
        $("html, body").animate({
            scrollTop: 0
        }, 700);
        return false;
    });


    /*----- SideBar Menu On click -----*/
    var $menu_left = $(".side-nav-left");
    var $menu_right = $(".side-nav-right");
    var $menu_full = $(".full-nav");
    var $toggler = $("#menu_bars");
    if ($("#menu_bars").length) {
        $("body").addClass("side-nav-push");

        if ($toggler.hasClass("left")) {
            $toggler.on("click", function(e) {
                $(this).toggleClass("active");
                var fade_logo = $(".navbar-logo-fade #menu_bars");
                if (!$(".navbar-logo-fade").hasClass("fixed-fade") && fade_logo.hasClass("active")) {
                    $(".navbar-brand").addClass("d-none");
                } else if ($(".navbar-logo-fade").hasClass("fixed-fade")) {
                    $(".navbar-brand").addClass("d-none");
                } else {
                    $(".navbar-brand").removeClass("d-none");
                }
                $(".side-nav-push").toggleClass("side-nav-push-toright");
                $menu_left.toggleClass("side-nav-open");
                e.stopPropagation();
            });
        } else if ($toggler.hasClass("right")) {
            $toggler.on("click", function(e) {
                $(this).toggleClass("active");
                $(".side-nav-push").toggleClass("side-nav-push-toleft");
                $menu_right.toggleClass("side-nav-open");
                e.stopPropagation();
            });
        } else {
            if ($toggler.hasClass("full")) {
                $toggler.on("click", function(e) {
                    $(this).toggleClass("active");
                    $menu_full.toggleClass("side-nav-open");
                    e.stopPropagation();
                });
            }
        }
    }



    if ($(".navbar-logo-fade").length) {
        $window.on("scroll", function() {
            if ($window.scrollTop() > 590) {
                $(".navbar-logo-fade").addClass("fixed-fade");
                $(".navbar-logo-fade .navbar-brand").addClass("d-none");
            } else {
                $(".navbar-logo-fade").removeClass("fixed-fade");
                $(".navbar-logo-fade .navbar-brand").removeClass("d-none");
            }
        });
    }





    // Pricing Table Hover Function Toggle
    $(".pricing-table-inner").hover(function() {
        if ($window.width() > 768) {
            $(".pricing-table-inner.main").removeClass("active");
            $(this).addClass("active");
        }
    }, function() {
        $(this).removeClass("active");
        $(".pricing-table-inner.main").addClass("active");
    });








    /*---- Wow Initializing ----*/
    /*new WOW().init();*/
    var wow = new WOW({
        boxClass: 'wow',
        animateClass: 'animated',
        offset: 0,
        mobile: false,
        live: true
    });
    new WOW().init();





});