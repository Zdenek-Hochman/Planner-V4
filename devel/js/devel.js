import {Grid} from "./class/grid.js";
import {Enabler} from "./class/enabler.js";
import {MMatrix} from "./class/math.js";
import {Element} from "./class/element.js";

window.onload = function() {
    const Planner = {
        Status: {
            Movement: false,
            Selection: false,
            Rotation: false,
            Resizing: false
        },
        Zoom: 1,
        Groups: {
            WallGroup: "",
            FurnitureGroup: ""
        }
    }
    const Matrix = new MMatrix();
    const Handler = new Element();

    const View = document.querySelector("#View");

    $(function DefaultSetting(){
        const CenterX = (10000 / 2) - (window.innerWidth / 2);
        const CenterY = (10000 / 2) - (window.innerHeight / 2);

        // View.setAttribute("viewBox",  ""+CenterX+" "+CenterY+" 10000 10000");

        Planner.Groups.WallGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g');
        Planner.Groups.WallGroup.setAttribute("id","WallGroup")
        Planner.Groups.FurnitureGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g');
        Planner.Groups.FurnitureGroup.setAttribute("id","FurnitureGroup");

        // const DragRectGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g');
        // const RectGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g');
        // const WallGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g');

        View.append(Planner.Groups.WallGroup);
        View.append(Planner.Groups.FurnitureGroup);
    });

    const WatchStatus = new Proxy(Planner.Status, {
        set: function (target, key, value) {
            target[key] = value;

            SetFunctions();
            return true;
        }
    });

    $("input[name='mouseType']").on("click", function() {
        const EnableStatus = new Enabler($(this));

        switch(EnableStatus.type) {
            case "mouseMovement":
                WatchStatus.Movement = true;
            break;
            case "mouseSelection":
                WatchStatus.Movement = false;
            break;
            case "mouseRotation":
                WatchStatus.Movement = false;
            break;
            case "mouseResizing":
                WatchStatus.Movement = false;
            break;
        };
    })

    $("#mouseMovement").trigger("click");

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
        Planner.Groups.FurnitureGroup.append(Handler.Create());
    })

    function SetFunctions() {
        $("body").off();
        $("document").off();

        const GridInstance = new Grid(View, Planner);
    }
}
