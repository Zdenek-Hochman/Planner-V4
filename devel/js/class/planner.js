import {GRID} from "./grid.js";
import {BASE} from "./functions.js";
import {ELEMENT} from "./element.js"

export class PLANNER {
    static #_PLANNER_;

    constructor() {
        PLANNER.#_PLANNER_ = {
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
            SetFunctions: function(PLANNER) {
                $("document").off();
                $("body").off();

                new GRID(PLANNER);
                new ELEMENT(PLANNER);
            }
        }
        this.WatchStatus = new Proxy(this, {
            set: function (target, key, value) {
                PLANNER.#_PLANNER_.Status[key] = value;
                PLANNER.#_PLANNER_.SetFunctions(PLANNER.#_PLANNER_);
                return true;
            }
        });
        this.#DefaultSetting();
    }

    #DefaultSetting() {
        const CenterX = (10000 / 2) - (window.innerWidth / 2);
        const CenterY = (10000 / 2) - (window.innerHeight / 2);

        // View.setAttribute("viewBox",  ""+CenterX+" "+CenterY+" 10000 10000");

        PLANNER.#_PLANNER_.Groups.WallGroup = $(BASE.CreateNS('g')).attr("id", "WallGroup");
        PLANNER.#_PLANNER_.Groups.FurnitureGroup = $(BASE.CreateNS('g')).attr("id","FurnitureGroup");
        PLANNER.#_PLANNER_.Groups.View = $("#View");

        PLANNER.#_PLANNER_.Groups.View.append(PLANNER.#_PLANNER_.Groups.WallGroup).append(PLANNER.#_PLANNER_.Groups.FurnitureGroup);
    }

    get Get_PLANNER_() {
        return PLANNER.#_PLANNER_;
    }
}
