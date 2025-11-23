import { BooleanPropertyInput } from "@amodx/schemas";
import { SchemaEditorInputRegister } from "../../SchemaEditorInputRegister";
import { SEInputBase } from "../../SEInputBase";
import { SEInputBaseProps } from "../../SEInputElement";
import { elm, useSignal, ElementChildren } from "@amodx/elm";
SchemaEditorInputRegister.register(
  BooleanPropertyInput,
  BooleanPropertyInput.createPropertyRenderFC<
    ElementChildren,
    SEInputBaseProps
  >((props) => {
    const { node } = props;
    const updateInput = useSignal();
    node.observers.updatedOrLoadedIn.subscribe(() => updateInput.broadcast());
    return SEInputBase(
      props,
      elm("input", {
        className: "input",
        type: "checkbox",
        checked: Boolean(node.get()),
        onchange: ({ target }) => {
          node.update(Boolean((target as HTMLInputElement).checked));
        },
        signal: updateInput.add(
          (elm) => ((elm as HTMLInputElement).checked = Boolean(node.get()))
        ),
      })
    );
  })
);
