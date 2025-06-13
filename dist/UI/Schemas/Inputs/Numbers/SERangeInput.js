import { RangePropertyInput } from "@amodx/schemas";
import { SchemaEditorInputRegister } from "../../SchemaEditorInputRegister";
import { SEInputBase } from "../../SEInputBase";
import { elm, useSignal } from "@amodx/elm";
SchemaEditorInputRegister.register(RangePropertyInput, RangePropertyInput.createPropertyRenderFC((props) => {
    const updateInput = useSignal();
    const { node } = props;
    const input = node.input.data.properties;
    node.observers.updatedOrLoadedIn.subscribe(() => updateInput.broadcast());
    return SEInputBase(props, elm("input", {
        className: "input",
        type: "range",
        min: String(input.min),
        max: String(input.max),
        step: String(input.step),
        defaultValue: String(node.get()),
        oninput({ target }) {
            node.update(parseFloat(target.value));
        },
        signal: updateInput((elm) => {
            elm.value = String(node.get());
        }),
    }));
}));
