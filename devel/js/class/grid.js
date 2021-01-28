export class Grid {
    constructor(Planner) {
        this.Planner = Planner;
        this.View = this.Planner.Groups.View[0];
        this.ViewBox = this.View.viewBox.baseVal;

        this.SlidingGrid();
        this.ZoomGrid();
    }

    SlidingGrid() {
        if(this.Planner.Status.Movement === true) {
            const INSTANCE = this;

            $("body").on("mousedown", "#Pattern", function(event) {
                const ViewBoxX = INSTANCE.ViewBox.x, ViewBoxY = INSTANCE.ViewBox.y, ViewBoxW = INSTANCE.ViewBox.width, ViewBoxH = INSTANCE.ViewBox.height;
                const StartX = event.pageX, StartY = event.pageY;

                $(document).on("mousemove", function(event) {
                    let x = ViewBoxX - (event.pageX - StartX);
                    let y = ViewBoxY - (event.pageY - StartY);

                    INSTANCE.View.setAttribute("viewBox", ""+x+" "+y+" "+ViewBoxW+" "+ViewBoxH+"");
                });
            })
            $(document).on("mouseup", function(){ $(document).off("mousemove"); });
        }
    }

    ZoomGrid() {
        const INSTANCE = this;
        const zoomMax = 0.1, zoomMin = 5, step = 0.95;
        let newSize = 0, oldSize = 10000, originalSize = 10000, newX = 0, newY = 0;

        window.addEventListener("wheel", function(event) {
            event.preventDefault();

            if(event.deltaY < 0) {
                newSize = INSTANCE.ViewBox.width * ((INSTANCE.ViewBox.width / originalSize < zoomMax) ? 1 : step);
            } else if(event.deltaY > 0) {
                newSize = INSTANCE.ViewBox.height / ((INSTANCE.ViewBox.height / originalSize > zoomMin) ? 1 : step);
            }
             newX = INSTANCE.ViewBox.x - (event.pageX / originalSize * (newSize - oldSize));
             newY = INSTANCE.ViewBox.y - (event.pageY / originalSize * (newSize - oldSize));

             oldSize = newSize;
             INSTANCE.Zoom = originalSize / newSize;
             // ShowActualZoom(Planner.Zoom);

             INSTANCE.View.setAttribute("viewBox", ""+newX+" "+newY+" "+newSize+" "+newSize+"");
        }, {passive: false} );

        this.DisableDefaultZoom();
    }

    DisableDefaultZoom() {
        $(document).on("keydown", function(event) {
            if (event.ctrlKey == true && (event.which == 61 || event.which == 107 || event.which == 173 || event.which == 109  || event.which == 187  || event.which == 189  ) ) {
                event.preventDefault();
            }
        });
    }
}
