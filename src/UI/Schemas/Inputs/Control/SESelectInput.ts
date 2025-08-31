import { SelectPropertyInput } from "@amodx/schemas";
import { SchemaEditorInputRegister } from "../../SchemaEditorInputRegister";
import { ElementChildren, elm } from "@amodx/elm";
import { SEInputBase } from "../../SEInputBase";
import { SEInputBaseProps } from "../../SEInputElement";
SchemaEditorInputRegister.register(
  SelectPropertyInput,
  SelectPropertyInput.createPropertyRenderFC<ElementChildren, SEInputBaseProps>(
    (props) => {
      const { node } = props;
      const input = node.input!.data;

      const options = input.properties.options.map((item) => {
        return elm(
          "option",
          {
            selected:
              String(Array.isArray(item) ? item[0] : item) == node.get(),
            value: String(Array.isArray(item) ? item[1] : item),
          },
          String(Array.isArray(item) ? item[0] : item)
        );
      });
      return SEInputBase(
        props,
        elm(
          "select",
          {
            className: "input",
            value: String(node.get()),
            onchange: ({ target }) => {
              node.update((target as HTMLInputElement).value);
            },
            hooks: {
              afterRender(elm) {
                node.observers.set.subscribe(node, () => {
                  elm.value = String(node.get());
                });
              },
            },
          },
          options
        )
      );
    }
  )
);
