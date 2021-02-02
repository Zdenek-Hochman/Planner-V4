import {BASE} from "./functions.js";
import {MATRIX, GONIOMETRIC, VECTOR} from "./math.js";
import {CONST} from "../constant.js";

export class ELEMENT {
    static _CIRCLE_CLASS_;
    static #_PLANNER_;

    constructor(Planner) {
        ELEMENT._CIRCLE_CLASS_ = [["LeftTop", "LeftBottom", "Left"],["RightTop", "RightBottom", "Right"],["RightTop", "LeftTop", "Top"],["LeftBottom", "RightBottom", "Bottom"]];
        ELEMENT.#_PLANNER_ = Planner || CONST._MEMORY_;

        this.#Move();
        this.#Resize();
    }

    Create(MainGroup) {
        const DragRectGroup = $(BASE.CreateNS("g")).attr({
            class: CONST._RECT_GROUP_,
            transform: `matrix(${MATRIX.Identity()})`
        });

        $(MainGroup).append($(DragRectGroup).append(this.#GenerateElement()));

        this.#GenerateResizeButtons(this.#GenerateElement(), DragRectGroup);
    }

    #GenerateElement() {
        return $(BASE.CreateNS("rect")).attr({
            width: "300",
            height: "300",
            class: CONST._RECT_,
            transform: `matrix(${MATRIX.Identity()})`
        })
    }

    #GenerateResizeButtons(Rect, Group) {
        const DragX = Rect.attr("width"), DragY = Rect.attr("height");
        let ResultX, ResultY;

        const Circle = $(BASE.CreateNS("circle")).attr({r:4});

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
                        transform: `matrix(${MATRIX.Identity()})`,
                        class: Values[y+=1]+" "+CONST._CIRCLE_
                    }).appendTo(Group)
                }
            }
        }
    }

    #Move() {
        if(this.Get_PLANNER_.Status.Movement === true) {
            $("body").on("mousedown", `.${CONST._RECT_}`, function(event) {
                const Group = $(this).parent(`.${CONST._RECT_GROUP_}`);
                const GroupMatrix = BASE.GetT(Group);

                const Pos = { x: event.clientX, y: event.clientY };

                $(document).on("mousemove", function(event) {
                    const x = event.clientX - Pos.x;
                    const y = event.clientY - Pos.y;

                    BASE.Transform(Group, [x, y], GroupMatrix);
                });
                $("body").off("mouseup").on("mouseup", function(){ $(document).off("mousedown");  });
            });
        }
    };

    #Resize(Displacement) {
		$("body").on("mousedown", `.${CONST._CIRCLE_}`, function(event) {
            const Memory = {};

            Memory.Circle = $(this);
            Memory.Group = Memory.Circle.parent();
            Memory.Rect = Memory.Circle.siblings().first();
            Memory.RectBox = BASE.EBox(Memory.Rect);
            Memory.RectDecompose = MATRIX.Decompose(BASE.GetT(Memory.Rect));
            Memory.LocalX = 0; Memory.LocalY = 0;
            Memory.CircleData = ELEMENT._CIRCLE_CLASS_.map(value => value.map(selector => MATRIX.Decompose(BASE.GetT(Memory.Circle.parent().find(`.${selector}`)))));

            const Displacement = new Map();
            Displacement.set("x", Memory.RectDecompose.x)
            Displacement.set("y", Memory.RectDecompose.y)

            $(document).on("mousemove", function(event) {
                this.#ResizeHorizontal(Memory, Displacement, event);
                this.#ResizeVertical(Memory, Displacement, event);
            })

            $("body").off("mouseup").on("mouseup", function() {
                Memory.Rect.siblings(".Top, .Bottom").attr("cx", BASE.EBox(Memory.Rect).width/2 + MATRIX.Decompose(BASE.GetT(Memory.Rect)).x);
                Memory.Rect.siblings(".Left, .Right").attr("cy", BASE.EBox(Memory.Rect).height/2 + MATRIX.Decompose(BASE.GetT(Memory.Rect)).y);

                $(document).off("mousedown");
            });
        })
    }

    #ResizeHorizontal(Memory, Displacement, event) {
        switch(Memory.Circle.attr("class").split(" ")[0]) {
            case "Left": case "LeftBottom": case "LeftTop":
                const RightBox = BASE.EBox(Memory.Circle.siblings(".Right"));
                Memory.LocalX = INSTANCE.GONIOMETRIC.Cos(0) * (event.pageX - RightBox.left) -  INSTANCE.GONIOMETRIC.Sin(0) * (event.pageY - RightBox.top);

                Displacement.x = (Memory.LocalX / 1) + Memory.RectBox.width;

                Memory.Rect.attr("width",(-Memory.LocalX/1));
                INSTANCE.BASE.Transform(Memory.Rect, {x: Displacement.x + Memory.RectDecompose.x});

                $.each(INSTANCE.CircleClass[0], function(Index, Val) {
                    const ActualHandler = Memory.Group.find(`.${INSTANCE.CircleClass[0][Index]}`);

                    INSTANCE.BASE.Transform(ActualHandler, {x: Displacement.x + Memory.CircleData[0][Index].x});
                })
            break;
            case "Right": case "RightBottom": case "RightTop":
                const LeftBox = INSTANCE.BASE.EBox(Memory.Circle.siblings(".Left"));
                Memory.LocalX = INSTANCE.GONIOMETRIC.Cos(0) * (event.clientX - LeftBox.left) - INSTANCE.GONIOMETRIC.Sin(0) * (event.clientY - LeftBox.top);

                Memory.Rect.attr("width",(Memory.LocalX / 1));

                $.each(INSTANCE.CircleClass[1], function(Index, Val) {
                    const ActualHandler = Memory.Group.find(`.${INSTANCE.CircleClass[1][Index]}`);

                    INSTANCE.BASE.Transform(ActualHandler, {x: Memory.LocalX - Memory.RectBox.width + Memory.CircleData[1][Index].x});
                })
            break;
        }
    }

    #ResizeVertical(Memory, Displacement, event) {
        const INSTANCE = this;

        switch(Memory.Circle.attr("class").split(" ")[0]) {
            case "Top": case "RightTop": case "LeftTop":
                const BottomBox = INSTANCE.BASE.EBox(Memory.Circle.siblings(".Bottom"));
                Memory.LocalY = INSTANCE.GONIOMETRIC.Sin(0) * (event.clientX - BottomBox.left) + INSTANCE.GONIOMETRIC.Cos(0) * (event.clientY - BottomBox.top);

                Displacement.y = (Memory.LocalY / 1) + Memory.RectBox.height;
                Memory.Rect.attr("height", (-Memory.LocalY / 1))

                INSTANCE.BASE.Transform(Memory.Rect, {y: Displacement.y + Memory.RectDecompose.y});

                $.each(INSTANCE.CircleClass[2], function(Index) {
                    const ActualHandler = Memory.Group.find(`.${INSTANCE.CircleClass[2][Index]}`);

                    INSTANCE.BASE.Transform(ActualHandler, {y: Displacement.y + Memory.CircleData[2][Index].y});
                })
            break;
            case "Bottom": case "RightBottom": case "LeftBottom":
                const TopBox = INSTANCE.BASE.EBox(Memory.Circle.siblings(".Top"));
                Memory.LocalY = INSTANCE.GONIOMETRIC.Sin(0) * (event.clientX - TopBox.left) + INSTANCE.GONIOMETRIC.Cos(0) * (event.clientY - TopBox.top);

                Memory.Rect.attr("height", (Memory.LocalY / 1));

                $.each(INSTANCE.CircleClass[3], function(Index) {
                    const ActualHandler = Memory.Group.find(`.${INSTANCE.CircleClass[3][Index]}`);

                    INSTANCE.BASE.Transform(ActualHandler, {y: Memory.LocalY - Memory.RectBox.height + Memory.CircleData[3][Index].y});
                })
            break;
        }
    }

    get Get_PLANNER_() {
        return ELEMENT.#_PLANNER_;
    }
}
