import { SEInputElement } from "./SEInputElement";
import { RegisteredInput } from "@amodx/schemas/Inputs";
export declare class SchemaEditorInputRegister {
    private static _components;
    static get(id: string): SEInputElement;
    static register(input: RegisteredInput, component: SEInputElement): void;
}
