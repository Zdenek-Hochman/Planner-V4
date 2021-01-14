export class Element {
    constructor() {
    }

    Create() {
        const dragRectGroup = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
        dragRectGroup.setAttribute("id","DragRect");

        this.GenerateResizeButtons(this.GenerateElement(), dragRectGroup);

        return dragRectGroup;
    }

    GenerateElement() {
        const element = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
        element.setAttribute("width","300");
        element.setAttribute("height","300");
        element.setAttribute("fill","black");
        element.setAttribute("class","move");

        return element;
    }

    GenerateResizeButtons(Rect, Group) {
        let DragX = $(Rect).width(), DragY = $(Rect).height(), ResultX, ResultY;

        let Circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
        Circle.setAttribute("radius","4");
        Circle.setAttribute("fill","green");

        let Values = ["LeftTop", "LeftBottom", "Left", "RightTop", "RightBottom", "Right", "Top", "Bottom"], y=-1;

        for(let i = 0; i <= 2; i++) {
            ResultX = DragX/i;
            if(ResultX == Infinity) ResultX = 0;

            for(let x = 0; x <= 2; x++) {
                ResultY = DragY/x;
                if(ResultY == Infinity) ResultY = 0;

                if(ResultX != DragX/2 || ResultY != DragY/2) {
                    const cloneCircle = Circle.cloneNode(true)
                    cloneCircle.setAttribute("cx",ResultX)
                    cloneCircle.setAttribute("cy",ResultY)
                    cloneCircle.setAttribute("class",`${Values[y+=1]} DragCircle`);
                    $(Group).append(cloneCircle);
                }
            }
        }
    }
}
