import { HexColorPropertyInput } from "@amodx/schemas";
import { SchemaEditorInputRegister } from "../../SchemaEditorInputRegister";
import { SEInputBase } from "../../SEInputBase";
import { elm, useSignal } from "@amodx/elm";
SchemaEditorInputRegister.register(HexColorPropertyInput, HexColorPropertyInput.createPropertyRenderFC((props) => {
    const { node } = props;
    const updateInput = useSignal();
    node.observers.updatedOrLoadedIn.subscribe(() => updateInput.broadcast());
    return SEInputBase(props, elm("input", {
        className: "input",
        type: "color",
        defaultValue: String(node.get()),
        oninput: ({ target }) => {
            node.update(target.value);
        },
        signal: updateInput((elm) => (elm.value = String(node.get()))),
    }));
}));
