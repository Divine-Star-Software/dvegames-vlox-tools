import { Observable } from "@amodx/core/Observers";
export class ItemSearchManager {
    static search = "";
    static searchNodes = [];
    static searchUpdated = new Observable();
    static filterAdded = new Observable();
    static filterRemoved = new Observable();
    static filtersUpdated = new Observable();
    static filters = [];
    static updateSearch(search) {
        this.search = search;
        this.searchNodes = search
            .split(" ")
            .map((_) => _.trim().toLocaleLowerCase());
        this.searchUpdated.notify();
    }
    static createFilter(id, value) {
        return [id, value];
    }
    static setFilter(v) {
        this.filters.push(v);
        this.filterAdded.notify(v);
        this.filtersUpdated.notify();
        return v;
    }
    static removeFilter(v) {
        const i = this.filters.findIndex((_) => _ == v);
        if (i < 0)
            return;
        this.filters.splice(i, 1);
        this.filterRemoved.notify(v);
        this.filtersUpdated.notify();
    }
}
