import {Grid} from "./grid.js";
import {Base} from "./functions.js";

export class Planner {
    constructor() {
        this.BASE = new Base();

        this.PLANNER = {
            Status: {
                Movement: false,
                Selection: false,
                Rotation: false,
                Resizing: false
            },
            Zoom: 1,
            Groups: {
                WallGroup: "",
                FurnitureGroup: "",
                View: ""
            },
            Displacement: {
                x:0,
                y:0
            },
            SetFunctions: function(PLANNER) {
                $("document").off();
                $("body").off();

                new Grid(PLANNER);
            }
        }

        this.WatchStatus = new Proxy(this, {
            set: function (target, key, value) {
                target.PLANNER.Status[key] = value;
                target.PLANNER.SetFunctions(target.PLANNER);
                return true;
            }
        });

        this.DefaultSetting(this.PLANNER);
    }

    DefaultSetting(PLANNER) {
        const INSTANCE = this;

        const CenterX = (10000 / 2) - (window.innerWidth / 2);
        const CenterY = (10000 / 2) - (window.innerHeight / 2);

        // View.setAttribute("viewBox",  ""+CenterX+" "+CenterY+" 10000 10000");

        PLANNER.Groups.WallGroup = $(INSTANCE.BASE.CreateNS('g')).attr("id", "WallGroup");
        PLANNER.Groups.FurnitureGroup = $(INSTANCE.BASE.CreateNS('g')).attr("id","FurnitureGroup");
        PLANNER.Groups.View = $("#View");

        PLANNER.Groups.View.append(PLANNER.Groups.WallGroup).append(PLANNER.Groups.FurnitureGroup);
    }
}
