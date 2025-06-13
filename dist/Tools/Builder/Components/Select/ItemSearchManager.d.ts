import { Observable } from "@amodx/core/Observers";
export declare class ItemSearchManager {
    static search: string;
    static searchNodes: string[];
    static searchUpdated: Observable<void>;
    static filterAdded: Observable<any>;
    static filterRemoved: Observable<any>;
    static filtersUpdated: Observable<void>;
    static filters: [id: string, value: any][];
    static updateSearch(search: string): void;
    static createFilter(id: string, value: any): [id: string, value: any];
    static setFilter(v: [id: string, value: any]): [id: string, value: any];
    static removeFilter(v: any): void;
}
