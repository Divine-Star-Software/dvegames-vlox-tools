import { SchemaNode } from "@amodx/schemas/Schemas/SchemaNode";
export declare const VectorInputBase: (props: string | (import("@amodx/elm").ProperOmit<Partial<HTMLDivElement> & {
    ref?: import("@amodx/elm").RefernceObject<HTMLDivElement> | undefined;
    signal?: import("@amodx/elm").SignalData<"div"> | import("@amodx/elm").SignalData<"div">[] | undefined;
    hooks?: {
        beforeRender?: () => void;
        afterRender?: ((elm: HTMLDivElement) => void) | undefined;
    } | undefined;
}, "style"> & {
    style?: import("@amodx/elm").RecursivePartial<HTMLElement["style"]>;
} & {
    node: SchemaNode;
    property: string;
}), ...children: import("@amodx/elm").ElementChildren[]) => HTMLDivElement;
