import {Planner} from "./class/planner.js";
import {Enabler} from "./class/enabler.js";
import {Element} from "./class/element.js";

window.onload = function() {
    const APP = new Planner();

    $("input[name='mouseType']").on("click", function() {
        const ENABLER = new Enabler($(this));

        switch(ENABLER.type) {
            case "mouseMovement":
                APP.WatchStatus.Movement = true;
            break;
            case "mouseSelection":
                APP.WatchStatus.Movement = false;
            break;
            case "mouseRotation":
                APP.WatchStatus.Movement = false;
            break;
            case "mouseResizing":
                APP.WatchStatus.Movement = false;
            break;
        };
    });

    $("#mouseMovement").trigger("click");

    const ELEMENT = new Element(APP.PLANNER.Displacement);

    $(".listButton").on("click", function() {
        if($(this).hasClass("active")) {
            $(this).animate({left: 0}, 500, "linear", function() { $(this).removeClass("active"); });
            $(".list").animate({left: -200}, 500, "linear", function() { });
        } else {
            $(this).animate({left: 200}, 500, "linear", function() { $(this).addClass("active"); });
            $(".list").animate({left: 0}, 500, "linear", function() { });
        }
    })

    $(".menuItems__item").on("click", function() {
        ELEMENT.Create(APP.PLANNER.Groups.FurnitureGroup);
    })
}
