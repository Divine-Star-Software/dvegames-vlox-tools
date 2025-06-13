import { Observable } from "@amodx/core/Observers";
import { ElementChildren } from "@amodx/elm";
import { PropertyInputBase } from "@amodx/schemas/Inputs/PropertyInput";
import { PropertyRenderFC, PropertyRenderFCDefaultProps } from "@amodx/schemas/Property.types";
export declare class SchemaEditorObservers {
    validate: Observable<void>;
    loadIn: Observable<void>;
}
export declare class SchemaEditorNodeObservers {
    validate: Observable<void>;
    loadIn: Observable<void>;
}
export type SEInputBaseProps<Value = any, Input extends PropertyInputBase = any> = {
    schema: SchemaEditorObservers;
    observers: SchemaEditorNodeObservers;
};
export type SEProps<Value = any, Input extends PropertyInputBase = any> = PropertyRenderFCDefaultProps<Value, Input> & SEInputBaseProps;
export type SEInputElement<Value = any, Input extends PropertyInputBase = any> = PropertyRenderFC<ElementChildren, Value, Input, SEInputBaseProps>;
