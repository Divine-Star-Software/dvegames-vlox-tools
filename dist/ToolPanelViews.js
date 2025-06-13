export class ToolPanelViews {
    static views = new Map();
    static registerView(id, view) {
        this.views.set(id, view);
    }
    static getView(id) {
        const view = this.views.get(id);
        if (!view)
            throw new Error(`View with ${id} does not exist`);
        return view;
    }
    static getViews() {
        return [...this.views.keys()];
    }
}
