import { StringPropertyInput } from "@amodx/schemas";
import { SchemaEditorInputRegister } from "../../SchemaEditorInputRegister";
import { SEInputBase } from "../../SEInputBase";
import { elm, useSignal } from "@amodx/elm";
SchemaEditorInputRegister.register(StringPropertyInput, StringPropertyInput.createPropertyRenderFC((props) => {
    const { node } = props;
    const updateInput = useSignal();
    node.observers.updatedOrLoadedIn.subscribe(() => updateInput.broadcast());
    return SEInputBase(props, elm("input", {
        className: "input",
        type: "string",
        defaultValue: String(node.get()),
        oninput: ({ target }) => {
            node.update(target.value);
        },
        signal: updateInput((elm) => (elm.value = String(node.get()))),
    }));
}));
