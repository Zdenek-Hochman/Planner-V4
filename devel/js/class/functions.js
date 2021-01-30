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

        const transform = getEl.attr("transform").replace(/[a-zA-Z()]+/g, '').split(",").map(function(number){
            return Number(number);
        });

        return transform;
    }

    Transform(el, pos, matrix) {
        matrix = matrix || this.Identity();

        if(this.isArray(pos) === true) {
            const newMatrix = this.FromTranslation({x: pos[0], y: pos[1]})

            el.attr("transform",`matrix(${this.Multiply(matrix ,newMatrix)})`);
        }

        if(this.isObject(pos) === true) {
            const M = this.GetT(el);

            if(typeof pos.x === "number") {
                M[0] = M[0];
                M[1] = M[1];
                M[2] = M[2];
                M[3] = M[3];
                M[4] = pos.x;
                M[5] = M[5];
            }
            if(typeof pos.y === "number") {
                M[0] = M[0];
                M[1] = M[1];
                M[2] = M[2];
                M[3] = M[3];
                M[4] = M[4];
                M[5] = pos.y;
            }
            el.attr("transform",`matrix(${M[0]},${M[1]},${M[2]},${M[3]},${M[4]},${M[5]})`);
        }
    }



    GetTrans(el) {
        return el.attr("transform").replace(/[()a-zA-Z ]+/g,'').split(",").map(function(val) { return Number(val) });
    }

    // SetT(el, mat, {x, y, r, v, m}={}) {
    //     const INSTANCE = this;
    //
    //     if(typeof v !== undefined && typeof v === "object") {
    //         el.attr("transform",`matrix(${INSTANCE.Translate(mat, v)})`);
    //     }
    //
    //     if(typeof m !== undefined && typeof m === "object") {
    //         el.attr("transform",`matrix(${m})`);
    //     }
    //

        // if(typeof x !== undefined && typeof x === "number") {
        //     const M = matrix;
        //
        //     M[0] = M[0],
        //     M[1] = M[1],
        //     M[2] = M[2],
        //     M[3] = M[3],
        //     M[4] = x,
        //     M[5] = M[5];
        //
        //     const NewMatrix = `${M[0]},${M[1]},${M[2]},${M[3]},${M[4]},${M[5]}`;
        //
        //     el.attr("transform",`matrix(${NewMatrix})`);
        // }
    // }

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
