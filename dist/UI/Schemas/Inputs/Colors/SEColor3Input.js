import { Color3PropertyInput } from "@amodx/schemas";
import { SchemaEditorInputRegister } from "../../SchemaEditorInputRegister";
import { SEInputBase } from "../../SEInputBase";
import { elm, useSignal } from "@amodx/elm";
import { convertRGBToHex, convertHexToRGB } from "./Functions";
SchemaEditorInputRegister.register(Color3PropertyInput, Color3PropertyInput.createPropertyRenderFC((props) => {
    const { node } = props;
    const updateInput = useSignal();
    node.observers.updatedOrLoadedIn.subscribe(() => updateInput.broadcast());
    return SEInputBase(props, elm("input", {
        className: "input",
        type: "color",
        defaultValue: convertRGBToHex(node.get()),
        oninput: ({ target }) => {
            node.update(convertHexToRGB(target.value));
        },
        signal: updateInput((elm) => (elm.value = convertRGBToHex(node.get()))),
    }));
}));
