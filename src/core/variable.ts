export enum VarType {
  BOOL,
  NUMBER,
  STRING,
}

export class ValueHolder {
  static newBOOL = (v = false) => new ValueHolder(VarType.BOOL, v);
  static newNUMBER = (v = 0) => new ValueHolder(VarType.NUMBER, v);
  static newSTRING = (v = '') => new ValueHolder(VarType.STRING, v);

  constructor(protected type: VarType, protected value: unknown) {}

  getType(): VarType {
    return this.type;
  }
  getRawValue(): unknown {
    return this.value;
  }
  asBoolean(): boolean {
    return this.value === true;
  }
  asNumber(): number {
    return parseFloat(`${this.value}`);
  }
  asString(): string {
    return `${this.value}`;
  }

  cast(type: VarType) {
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

  equalsValueType(value: ValueHolder) {
    return this.getType() === value.getType();
  }

  equalsValue(value: ValueHolder) {
    if (!this.equalsValueType(value)) return false;
    return this.value === value.getRawValue();
  }

  equalsValueWithTypeCast(value: ValueHolder) {
    return this.cast(value.type).equalsValue(value);
  }
}

export class Variable {
  static nextId = 0;
  static defineBOOL(name: string, value: boolean = false, id = ++this.nextId) {
    return new Variable(id, name, ValueHolder.newBOOL(value));
  }
  static defineNUMBER(name: string, value: number = 0, id = ++this.nextId) {
    return new Variable(id, name, ValueHolder.newNUMBER(value));
  }
  static defineSTRING(name: string, value: string = '', id = ++this.nextId) {
    return new Variable(id, name, ValueHolder.newSTRING(value));
  }

  constructor(public id: number, public name: string, public holder: ValueHolder) {}
}

export class VariableStore {
  constructor(protected list: Variable[]) {}

  findByName(varName: Variable['name']) {
    return this.list.filter(({ name }) => name === varName)[0];
  }
}
