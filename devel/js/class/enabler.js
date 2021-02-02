export class ENABLER {
    static #_TYPEV_ = null;

    static Enable(selector) {
        if(selector.is(":checked")) {
            $(".menuItems__checkedButton").css("backgroundColor","#333");
            selector.closest(".menuItems").find(".menuItems__checkedButton").css("backgroundColor","#0459AB");

            this.SetType = selector;
        };
    }

    static set SetType(selector) {
        this.#_TYPEV_ = selector.attr("id");
    }

    static get Type() {
        return this.#_TYPEV_;
    }
}
