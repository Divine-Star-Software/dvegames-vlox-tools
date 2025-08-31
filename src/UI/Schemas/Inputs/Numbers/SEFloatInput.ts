import { FloatPropertyInput } from "@amodx/schemas";
import { SchemaEditorInputRegister } from "../../SchemaEditorInputRegister";
import { SEInputBase } from "../../SEInputBase";
import { SEInputBaseProps } from "../../SEInputElement";
import { elm, useSignal, ElementChildren } from "@amodx/elm";
SchemaEditorInputRegister.register(
  FloatPropertyInput,
  FloatPropertyInput.createPropertyRenderFC<ElementChildren, SEInputBaseProps>(
    (props) => {
      const { node } = props;
      const updateInput = useSignal();
      node.observers.updatedOrLoadedIn.subscribe(() => updateInput.broadcast());
      const input = node.property.input!.properties;
      return SEInputBase(
        props,
        elm("input", {
          className: "input",
          type: "number",
          defaultValue: String(node.get()),
          min: input.min ? String(input.min) : undefined,
          max: input.max ? String(input.max) : undefined,
          oninput: ({ target }) => {
            const value = parseFloat((target as HTMLInputElement).value);
            node.update(Number.isNaN(value) ? 0 : value);
          },
          signal: updateInput((elm) => {
            (elm as HTMLInputElement).value = String(node.get());
          }),
        })
      );
    }
  )
);
