import { SEInputBaseProps } from "./SEInputElement";
export declare const SEInputBase: (props: string | (import("@amodx/elm").ProperOmit<Partial<HTMLDivElement> & {
    ref?: import("@amodx/elm").RefernceObject<HTMLDivElement> | undefined;
    signal?: import("@amodx/elm").SignalData<"div"> | import("@amodx/elm").SignalData<"div">[] | undefined;
    hooks?: {
        beforeRender?: () => void;
        afterRender?: ((elm: HTMLDivElement) => void) | undefined;
    } | undefined;
}, "style"> & {
    style?: import("@amodx/elm").RecursivePartial<HTMLElement["style"]>;
} & import("@amodx/schemas/Property.types").PropertyRenderFCDefaultProps<any, any> & SEInputBaseProps<any, any>), ...children: import("@amodx/elm").ElementChildren[]) => HTMLDivElement;
