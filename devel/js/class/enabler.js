export class Enabler {
    constructor(selector) {
        this.selector = selector;
        this.typeV = null;

        this.FunctionEnabler(this.selector);
    }

    FunctionEnabler(selector) {
        if(selector.is(":checked")) {
            $(".menuItems__checkedButton").css("backgroundColor","#333");
            selector.closest(".menuItems").find(".menuItems__checkedButton").css("backgroundColor","#0459AB");

            this.typeV = selector.attr("id");
        };
    }

    get type() {
        return this.typeV
    }
}
