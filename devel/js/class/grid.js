export class GRID {
    static #_PLANNER_;
    static _VIEW_;
    static _VIEWBOX_;

    constructor(Planner) {
        GRID.#_PLANNER_ = Planner;
        GRID._VIEW_ = Planner.Groups.View[0];
        GRID._VIEWBOX_ = Planner.Groups.View[0].viewBox.baseVal;

        this.#SlidingGrid();
        this.#ZoomGrid();
    }

    #SlidingGrid() {
        if(this.Get_PLANNER_.Status.Movement === true) {
            $("body").on("mousedown", "#Pattern", function(event) {
                const ViewBoxX = GRID._VIEWBOX_.x, ViewBoxY = GRID._VIEWBOX_.y, ViewBoxW = GRID._VIEWBOX_.width, ViewBoxH = GRID._VIEWBOX_.height;
                const StartX = event.pageX, StartY = event.pageY;

                $(document).on("mousemove", function(event) {
                    let x = ViewBoxX - (event.pageX - StartX);
                    let y = ViewBoxY - (event.pageY - StartY);

                    GRID._VIEW_.setAttribute("viewBox", `${x} ${y} ${ViewBoxW} ${ViewBoxH}`);
                });
            })
            $(document).on("mouseup", function(){ $(document).off("mousemove"); });
        }
    }

    #ZoomGrid() {
        const zoomMax = 0.1, zoomMin = 5, step = 0.95;
        let newSize = 0, oldSize = 10000, originalSize = 10000;

        window.addEventListener("wheel", function(event) {
            event.preventDefault();

            if(event.deltaY < 0) {
                newSize = GRID._VIEWBOX_.width * ((GRID._VIEWBOX_.width / originalSize < zoomMax) ? 1 : step);
            } else if(event.deltaY > 0) {
                newSize = GRID._VIEWBOX_.height / ((GRID._VIEWBOX_.height / originalSize > zoomMin) ? 1 : step);
            }
            let newX = GRID._VIEWBOX_.x - (event.pageX / originalSize * (newSize - oldSize));
            let newY = GRID._VIEWBOX_.y - (event.pageY / originalSize * (newSize - oldSize));

             oldSize = newSize;
             // INSTANCE.Zoom = originalSize / newSize;
             // ShowActualZoom(Planner.Zoom);

             GRID._VIEW_.setAttribute("viewBox", `${newX} ${newY} ${newSize} ${newSize}`);
        }, {passive: false} );

        this.#DisableDefaultZoom();
    }

    #DisableDefaultZoom() {
        $(document).on("keydown", function(event) {
            if (event.ctrlKey == true && (event.which == 61 || event.which == 107 || event.which == 173 || event.which == 109  || event.which == 187  || event.which == 189  ) ) {
                event.preventDefault();
            }
        });
    }

    get Get_PLANNER_() {
        return GRID.#_PLANNER_;
    }
}
