import { ButtonPropertyInput } from "@amodx/schemas";
import { SchemaEditorInputRegister } from "../../SchemaEditorInputRegister";
import { SEInputBaseProps } from "../../SEInputElement";
import { elm, ElementChildren } from "@amodx/elm";
SchemaEditorInputRegister.register(
  ButtonPropertyInput,
  ButtonPropertyInput.createPropertyRenderFC<ElementChildren, SEInputBaseProps>(
    (props) => {
      const { node } = props;
      return elm(
        "button",
        {
          className: "button",
          onclick(event) {
            event.preventDefault();
            console.warn("clicked", node, node.get());
            node.get()();
          },
        },
        node.property.name
      );
    }
  )
);
