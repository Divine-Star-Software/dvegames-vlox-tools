import { ElementChildren } from "@amodx/elm";
import { ObjectSchemaInstance } from "@amodx/schemas";
import "./Inputs/index";
import { SchemaCursor } from "@amodx/ncs/Schema/Schema.types";
export declare const SchemaEditor: (props: string | (import("@amodx/elm").ProperOmit<Partial<HTMLDivElement> & {
    ref?: import("@amodx/elm").RefernceObject<HTMLDivElement> | undefined;
    signal?: import("@amodx/elm").SignalData<"div"> | import("@amodx/elm").SignalData<"div">[] | undefined;
    hooks?: {
        beforeRender?: () => void;
        afterRender?: ((elm: HTMLDivElement) => void) | undefined;
    } | undefined;
}, "style"> & {
    style?: import("@amodx/elm").RecursivePartial<HTMLElement["style"]>;
} & {
    schemaInstance?: ObjectSchemaInstance;
    schema?: SchemaCursor<any>;
}), ...children: ElementChildren[]) => HTMLDivElement;
