import {MMatrix} from "./math.js";

export class Base extends MMatrix {
    constructor() {
        super();
    }

    // DuplicityIdRepair(Identificator) {
    //     if($("#" + Identificator).length != 0) {
    //         let LastElement = []
    //         $(".Move").each(function() {
    //             let Name = $(this).attr("id").replace(/[^A-Z a-z]/g, '');
    //
    //             if(Name == Identificator.replace(/[^A-Z a-z]/g, '')) {
    //                 LastElement.push($(this));
    //             }
    //         })
    //
    //         let Counter =  parseFloat(LastElement.pop().attr("id").replace(/[^0-9]/g, 0))+1;
    //         var NewIdentificator = Identificator.replace(/[^a-zA-Z]/g, '') + Counter
    //     }
    //     else{ let NewIdentificator = Identificator }
    //
    //     return NewIdentificator;
    // }


    GetT(el) {
        const getEl = (typeof el === "object") ? el : $(el);

        return getEl.attr("transform").replace(/[a-zA-Z()]+/g, '').split(",").map((number) => Number(number));
    }

    Transform(el, pos, matrix) {
        matrix = matrix || this.Identity();

        if(this.isArray(pos) === true) {
            const newMatrix = this.FromTranslation({x: pos[0], y: pos[1]})

            el.attr("transform",`matrix(${this.Multiply(matrix ,newMatrix)})`);
        }

        if(this.isObject(pos) === true) {
            const M = this.GetT(el);

            if(typeof pos.x === "number" || typeof pos.y === "number") {
                const newMatrix = this.Multiply(this.FromMatrix(M, pos.x, pos.y), matrix);

                el.attr("transform",`matrix(${newMatrix})`);
            }
        }
    }

    GetTrans(el) {
        return el.attr("transform").replace(/[()a-zA-Z ]+/g,'').split(",").map(function(val) { return Number(val) });
    }

    CreateNS(type) {
        return document.createElementNS("http://www.w3.org/2000/svg", type);
    }

    EBox(el) {
        return el[0].getBoundingClientRect();
    }

    isArray(a) {
        return (!!a) && (a.constructor === Array);
    }

    isObject(a) {
        return (!!a) && (a.constructor === Object);
    };
}
