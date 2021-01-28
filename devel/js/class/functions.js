export class Base {
    constructor() {
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

    Transform(el) {
        const transform = $(el).attr("transform").replace(/[a-zA-Z()]+/g, '').split(",").map(function(number){
            return Number(number);
        });

        return transform;
    }

    Set(el, matrix) {
        el.attr("transform",`matrix(${matrix})`);
    }

    CreateNS(type) {
        return document.createElementNS("http://www.w3.org/2000/svg", type);
    }

    EBox(el) {
        return el[0].getBoundingClientRect();
    }
}
