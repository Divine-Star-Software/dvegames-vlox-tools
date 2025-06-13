export class SchemaEditorInputRegister {
    static _components = new Map();
    static get(id) {
        const component = this._components.get(id);
        if (!component)
            throw new Error(`SEInputElement with id [${id}] does not exist`);
        return component;
    }
    static register(input, component) {
        this._components.set(input.id, component);
    }
}
