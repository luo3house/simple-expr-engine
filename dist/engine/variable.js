"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariableStore = exports.Variable = exports.ValueHolder = exports.VarType = void 0;
var VarType;
(function (VarType) {
    VarType[VarType["BOOL"] = 0] = "BOOL";
    VarType[VarType["NUMBER"] = 1] = "NUMBER";
    VarType[VarType["STRING"] = 2] = "STRING";
})(VarType = exports.VarType || (exports.VarType = {}));
class ValueHolder {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
    getType() {
        return this.type;
    }
    getRawValue() {
        return this.value;
    }
    asBoolean() {
        return this.value === true;
    }
    asNumber() {
        return parseFloat(`${this.value}`);
    }
    asString() {
        return `${this.value}`;
    }
    cast(type) {
        switch (type) {
            case VarType.BOOL:
                switch (this.type) {
                    case VarType.NUMBER:
                        return ValueHolder.newBOOL(this.asNumber() !== 0);
                    case VarType.STRING:
                        return ValueHolder.newBOOL(this.asString().length > 0);
                }
                break;
            case VarType.NUMBER:
                switch (this.type) {
                    case VarType.BOOL:
                        return ValueHolder.newNUMBER(this.asBoolean() ? 1 : 0);
                    case VarType.STRING:
                        return ValueHolder.newNUMBER(this.asNumber());
                }
                break;
            case VarType.STRING:
                switch (this.type) {
                    case VarType.BOOL:
                        return ValueHolder.newSTRING(this.asBoolean() ? 'true' : 'false');
                    case VarType.NUMBER:
                        return ValueHolder.newSTRING(`${this.asNumber()}`);
                }
                break;
        }
        return this;
    }
    equalsValueType(value) {
        return this.getType() === value.getType();
    }
    equalsValue(value) {
        if (!this.equalsValueType(value))
            return false;
        return this.value === value.getRawValue();
    }
    equalsValueWithTypeCast(value) {
        return this.cast(value.type).equalsValue(value);
    }
}
exports.ValueHolder = ValueHolder;
ValueHolder.newBOOL = (v = false) => new ValueHolder(VarType.BOOL, v);
ValueHolder.newNUMBER = (v = 0) => new ValueHolder(VarType.NUMBER, v);
ValueHolder.newSTRING = (v = '') => new ValueHolder(VarType.STRING, v);
class Variable {
    constructor(id, name, holder) {
        this.id = id;
        this.name = name;
        this.holder = holder;
    }
    static defineBOOL(name, value = false, id = ++this.nextId) {
        return new Variable(id, name, ValueHolder.newBOOL(value));
    }
    static defineNUMBER(name, value = 0, id = ++this.nextId) {
        return new Variable(id, name, ValueHolder.newNUMBER(value));
    }
    static defineSTRING(name, value = '', id = ++this.nextId) {
        return new Variable(id, name, ValueHolder.newSTRING(value));
    }
}
exports.Variable = Variable;
Variable.nextId = 0;
class VariableStore {
    constructor(list) {
        this.list = list;
    }
    findByName(varName) {
        return this.list.filter(({ name }) => name === varName)[0];
    }
}
exports.VariableStore = VariableStore;
