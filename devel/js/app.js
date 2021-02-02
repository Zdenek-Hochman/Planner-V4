import {PLANNER} from "./class/planner.js";
import {ENABLER} from "./class/enabler.js";
import {ELEMENT} from "./class/element.js";

window.onload = function() {
    const APP = new PLANNER();

    $("input[name='mouseType']").on("click", function() {
        ENABLER.Enable($(this));

        switch(ENABLER.Type) {
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

    const NEW_ELEMENT = new ELEMENT(PLANNER.Get_PLANNER_);

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
        NEW_ELEMENT.Create(APP.Get_PLANNER_.Groups.FurnitureGroup);
    })
}
