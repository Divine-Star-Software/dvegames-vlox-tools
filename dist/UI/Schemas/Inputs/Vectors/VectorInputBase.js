import { elm, frag, useSignal, wrap } from "@amodx/elm";
export const VectorInputBase = wrap("div", (props) => {
    const node = props.node;
    props.className = "vector-input-node";
    const updateInput = useSignal();
    node.observers.updatedOrLoadedIn.subscribe(() => {
        updateInput.broadcast();
    });
    node.observers.set.subscribe(() => {
        updateInput.broadcast();
    });
    return frag(elm("label", {
        className: "vector-input-label ",
    }, props.property), elm("input", {
        className: "input",
        type: "number",
        defaultValue: String(node.get()[props.property]),
        oninput: ({ target }) => {
            const vector = node.get();
            vector[props.property] = parseFloat(target.value);
            node.update(vector);
        },
        signal: updateInput((elm) => {
            const vector = node.get();
            elm.value = String(vector[props.property]);
        }),
    }));
});
