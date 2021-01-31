import {Base} from "./functions.js";
import {MMatrix, Goniometric, Vector} from "./math.js";
import {Const} from "../constant.js";

export class Element {
    constructor(Displacement) {
        this.MATRIX = new MMatrix();
        this.GONIOMETRIC = new Goniometric();
        this.VECTOR = new Vector();
        this.BASE = new Base();
        this.CONST = new Const();

        this.Move(Displacement);
        this.Resize(Displacement);

        this.CircleClass = [
            ["LeftTop", "LeftBottom", "Left"],
            ["RightTop", "RightBottom", "Right"],
            ["RightTop", "LeftTop", "Top"],
            ["LeftBottom", "RightBottom", "Bottom"]
        ];
    }

    Create(MainGroup) {
        const INSTANCE = this;

        const DragRectGroup = $(INSTANCE.BASE.CreateNS("g")).attr({
            class: INSTANCE.CONST.RGroup,
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
            class: INSTANCE.CONST.Rect,
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
                        transform: `matrix(${INSTANCE.MATRIX.Identity()})`,
                        // transform: "translate(0,0)",
                        class: Values[y+=1]+" "+INSTANCE.CONST.Circle
                    }).appendTo(Group)
                }
            }
        }
    }

    Move(Displacement) {
        const INSTANCE = this

        $("body").on("mousedown", `.${INSTANCE.CONST.Rect}`, function(event) {
            const Group = $(this).parent(`.${INSTANCE.CONST.RGroup}`);
            const GroupMatrix = INSTANCE.BASE.GetT(Group);

            const Pos = { x: event.clientX, y: event.clientY };

            $(document).on("mousemove", function(event) {
                const x = event.clientX - Pos.x;
                const y = event.clientY - Pos.y;

                INSTANCE.BASE.Transform(Group, [x, y], GroupMatrix);
            });
            $("body").off("mouseup").on("mouseup", function(){ $(document).off("mousedown");  });
        });
    };

    Resize(Displacement) {
        const INSTANCE = this;

		$("body").on("mousedown", `.${INSTANCE.CONST.Circle}`, function(event) {
            const Memory = {};

            Memory.Circle = $(this);
            Memory.Group = Memory.Circle.parent();
            Memory.Rect = Memory.Circle.siblings().first();
            Memory.RectBox = INSTANCE.BASE.EBox(Memory.Rect);
            Memory.RectMatrix = INSTANCE.BASE.GetT(Memory.Rect);
            Memory.RectDecompose = INSTANCE.MATRIX.Decompose(Memory.RectMatrix);
            Memory.LocalX = 0;
            Memory.LocalY = 0;
            Memory.CircleData = INSTANCE.CircleClass.map(value => value.map(selector => INSTANCE.BASE.GetT(Memory.Circle.parent().find(`.${selector}`))));

            Displacement.x = Memory.RectDecompose.x; Displacement.y = Memory.RectDecompose.y;

            $(document).on("mousemove", function(event) {
                INSTANCE.ResizeHorizontal(Memory, Displacement, event);
                INSTANCE.ResizeVertical(Memory, Displacement, event);
            })

            $("body").off("mouseup").on("mouseup", function() {
                // Memory.Rect.siblings(".Top, .Bottom").attr("cx", INSTANCE.BASE.EBox(Memory.Rect).width/2 + INSTANCE.MATRIX.Decompose(INSTANCE.BASE.Transform(Memory.Rect)).x);
                // Memory.Rect.siblings(".Left, .Right").attr("cy", INSTANCE.BASE.EBox(Memory.Rect).height/2 + INSTANCE.MATRIX.Decompose(INSTANCE.BASE.Transform(Memory.Rect)).y);

                $(document).off("mousedown");
            });
        })
    }

    ResizeHorizontal(Memory, Displacement, event) {
        const INSTANCE = this;

        switch(Memory.Circle.attr("class").split(" ")[0]) {
            case "Left": case "LeftBottom": case "LeftTop":
                const RightBox = INSTANCE.BASE.EBox(Memory.Circle.siblings(".Right"));
                Memory.LocalX = INSTANCE.GONIOMETRIC.Cos(0) * (event.pageX - RightBox.left) -  INSTANCE.GONIOMETRIC.Sin(0) * (event.pageY - RightBox.top);

                Displacement.x = (Memory.LocalX / 1) + Memory.RectBox.width;

                Memory.Rect.attr("width",(-Memory.LocalX/1));
                INSTANCE.BASE.Transform(Memory.Rect, {x: Displacement.x}, Memory.RectMatrix);

                $.each(INSTANCE.CircleClass[0], function(Index, Val) {
                    const ActualHandler = Memory.Group.find(`.${INSTANCE.CircleClass[0][Index]}`);

                    INSTANCE.BASE.Transform(ActualHandler, {x: Displacement.x}, Memory.CircleData[0][Index]);
                })
            break;
            case "Right": case "RightBottom": case "RightTop":
                const LeftBox = INSTANCE.BASE.EBox(Memory.Circle.siblings(".Left"));
                Memory.LocalX = INSTANCE.GONIOMETRIC.Cos(0) * (event.clientX - LeftBox.left) - INSTANCE.GONIOMETRIC.Sin(0) * (event.clientY - LeftBox.top);

                Memory.Rect.attr("width",(Memory.LocalX / 1));

                $.each(INSTANCE.CircleClass[1], function(Index, Val) {
                    const ActualHandler = Memory.Group.find(`.${INSTANCE.CircleClass[1][Index]}`);

                    INSTANCE.BASE.Transform(ActualHandler, {x: Memory.LocalX - Memory.RectBox.width}, Memory.CircleData[1][Index]);
                })
            break;
        }
    }

    ResizeVertical(Memory, Displacement, event) {
        const INSTANCE = this;

        switch(Memory.Circle.attr("class").split(" ")[0]) {
            case "Top": case "RightTop": case "LeftTop":
                const BottomBox = INSTANCE.BASE.EBox(Memory.Circle.siblings(".Bottom"));
                Memory.LocalY = INSTANCE.GONIOMETRIC.Sin(0) * (event.clientX - BottomBox.left) + INSTANCE.GONIOMETRIC.Cos(0) * (event.clientY - BottomBox.top);

                Displacement.y = (Memory.LocalY / 1) + Memory.RectBox.height;
                Memory.Rect.attr("height", (-Memory.LocalY / 1))

                INSTANCE.BASE.Transform(Memory.Rect, {y: Displacement.y}, Memory.RectMatrix);

                $.each(INSTANCE.CircleClass[2], function(Index) {
                    const ActualHandler = Memory.Group.find(`.${INSTANCE.CircleClass[2][Index]}`);

                    INSTANCE.BASE.Transform(ActualHandler, {y: Displacement.y}, Memory.CircleData[2][Index]);
                })
            break;
            case "Bottom": case "RightBottom": case "LeftBottom":
                const TopBox = INSTANCE.BASE.EBox(Memory.Circle.siblings(".Top"));
                Memory.LocalY = INSTANCE.GONIOMETRIC.Sin(0) * (event.clientX - TopBox.left) + INSTANCE.GONIOMETRIC.Cos(0) * (event.clientY - TopBox.top);

                Memory.Rect.attr("height", (Memory.LocalY / 1));

                $.each(INSTANCE.CircleClass[3], function(Index) {
                    const ActualHandler = Memory.Group.find(`.${INSTANCE.CircleClass[3][Index]}`);

                    INSTANCE.BASE.Transform(ActualHandler, {y: Memory.LocalY - Memory.RectBox.height}, Memory.CircleData[3][Index]);
                })
            break;
        }
    }
}
