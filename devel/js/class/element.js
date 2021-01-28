import {Base} from "./functions.js";
import {MMatrix} from "./math.js";

export class Element {
    constructor(Displacement) {
        this.MATRIX = new MMatrix();
        this.BASE = new Base();

        this.Move(Displacement);
        this.Resize(Displacement);

        this.CircleClass = ["LeftTop", "LeftBottom", "Left", "RightTop", "RightBottom", "Right", "LeftTop", "RightTop", "Top", "LeftBottom", "RightBottom", "Bottom"];
    }

    Create(MainGroup) {
        const INSTANCE = this;

        const DragRectGroup = $(INSTANCE.BASE.CreateNS("g")).attr({
            class: "DragRect",
            transform: `matrix(${INSTANCE.MATRIX.Identity()})`
        });

        $(MainGroup).append($(DragRectGroup).append(INSTANCE.GenerateElement()));

        INSTANCE.GenerateResizeButtons(INSTANCE.GenerateElement(), DragRectGroup);
    }

    GenerateElement() {
        const INSTANCE = this;

        return $(INSTANCE.BASE.CreateNS("rect")).attr({
            width: "300",
            height: "300",
            class: "Move",
            transform: `matrix(${INSTANCE.MATRIX.Identity()})`
        })
    }

    GenerateResizeButtons(Rect, Group) {
        const INSTANCE = this;

        const DragX = Rect.attr("width"), DragY = Rect.attr("height");
        let ResultX, ResultY;

        const Circle = $(INSTANCE.BASE.CreateNS("circle")).attr({r:4});

        let Values = ["LeftTop", "LeftBottom", "Left", "RightTop", "RightBottom", "Right", "Top", "Bottom"], y=-1;

        for(let i = 0; i <= 2; i++) {
            ResultX = DragX/i;
            if(ResultX == Infinity) ResultX = 0;

            for(let x = 0; x <= 2; x++) {
                ResultY = DragY/x;
                if(ResultY == Infinity) ResultY = 0;

                if(ResultX != DragX/2 || ResultY != DragY/2) {
                    const CloneCircle = Circle.clone()

                    CloneCircle.attr({
                        cx: ResultX,
                        cy: ResultY,
                        class: Values[y+=1]+" DragCircle"
                    }).appendTo(Group)
                }
            }
        }
    }

    Move(Displacement) {
        const INSTANCE = this

        $("body").on("mousedown", ".Move", function(event) {
            const Group = $(this).parent(".DragRect");
            const GroupMatrix = INSTANCE.BASE.Transform(Group);
            const GroupDecompose = INSTANCE.MATRIX.Decompose(GroupMatrix);
            const RectDecompose = INSTANCE.MATRIX.Decompose(INSTANCE.BASE.Transform($(this)));

            Displacement.x = RectDecompose.x, Displacement.y = RectDecompose.y;

            const StartPosition = { StartX: event.clientX, StartY: event.clientY };
            const CurrentPosition = { x: 0, y: 0 };

            $(document).on("mousemove", function(event) {
                CurrentPosition.x = event.clientX - StartPosition.StartX;
                CurrentPosition.y = event.clientY - StartPosition.StartY;

                INSTANCE.BASE.Set(Group, INSTANCE.MATRIX.Translate(GroupMatrix, {x: CurrentPosition.x, y: CurrentPosition.y}));
            });
            $("body").off("mouseup").on("mouseup", function(){ $(document).off("mousedown");  });
        });
    };

    Resize(Displacement) {
        const INSTANCE = this;

		$("body").on("mousedown", ".DragCircle", function(event) {
            const Circle = $(this), Group = Circle.parent(), Rect = Circle.siblings().first();
			const RectBox = INSTANCE.BASE.EBox(Rect), RectMatrix = INSTANCE.BASE.Transform(Rect), RectDecompose = INSTANCE.MATRIX.Decompose(RectMatrix);

            const GetBox = Class => INSTANCE.BASE.EBox(Circle.parent().find(Class));

			const ArrayCircle = [
                [GetBox(".LeftTop"), GetBox(".LeftBottom"), GetBox(".Left")],
                [GetBox(".RightTop"), GetBox(".RightBottom"), GetBox(".Right")],
                [GetBox(".RightTop"), GetBox(".LeftTop"), GetBox(".Top")],
                [GetBox(".RightBottom"), GetBox(".LeftBottom"), GetBox(".Bottom")]
            ];

            Displacement.x = RectDecompose.x; Displacement.y = RectDecompose.y;

            const Memory = {
                Circle: Circle,
                Group: Group,
                Rect: Rect,
                RectBox: RectBox,
                RectMatrix: RectMatrix,
                ArrayCircle: ArrayCircle,
            }

            $(document).on("mousemove", function(event) {
                INSTANCE.ResizeHorizontal(Memory, Displacement, event.pageX, event.pageY);
            })
    	})
    }

    ResizeHorizontal(Memory, Displacement, EventX, EventY) {
        const INSTANCE = this;

        switch(Memory.Circle.attr("class").split(" ")[0]) {
            case "Left": case "LeftBottom": case "LeftTop":
                const LocalX = (EventX - INSTANCE.BASE.EBox(Memory.Circle.siblings(".Right")).left) - (EventY - INSTANCE.BASE.EBox(Memory.Circle.siblings(".Right")).top);

                Displacement.x = (LocalX / 1) + INSTANCE.MATRIX.Decompose(Memory.RectMatrix).x + Memory.RectBox.width;

                INSTANCE.MATRIX.Translate(Memory.Rect.width(-LocalX / 1), {x:Displacement.x, y:0});
                // $.each(Memory.ArrayCircle[0], function(Index, Val) {
                //     INSTANCE.BASE.Set(Memory.Group.find(`.${INSTANCE.CircleClass[Index+0]}`), {x: Val.x + LocalX/1 + Memory.RectBox.width, y:0});
                // })
            break;
                    // case "Right": case "RightBottom": case "RightTop":
                    //     LocalX = Metric.Cos(Angle) * (EventX - $(Circle.node).siblings(".Left").position().left) - Metric.Sin(Angle) * (EventY - $(Circle.node).siblings(".Left").position().top);
                    //
                    //     Rect.width(LocalX / Zoom);
                    //     $.each(ArrayCircle[1], function(Index, Val){ Group.select("."+CircleClass[Index+3]).get(0).transform({x: Val.x + LocalX/Zoom - RectBox.width});})
                    //     break;
        }
    }
}
