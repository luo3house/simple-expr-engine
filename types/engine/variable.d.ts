export declare enum VarType {
    BOOL = 0,
    NUMBER = 1,
    STRING = 2
}
export declare class ValueHolder {
    protected type: VarType;
    protected value: unknown;
    static newBOOL: (v?: boolean) => ValueHolder;
    static newNUMBER: (v?: number) => ValueHolder;
    static newSTRING: (v?: string) => ValueHolder;
    constructor(type: VarType, value: unknown);
    getType(): VarType;
    getRawValue(): unknown;
    asBoolean(): boolean;
    asNumber(): number;
    asString(): string;
    cast(type: VarType): ValueHolder;
    equalsValueType(value: ValueHolder): boolean;
    equalsValue(value: ValueHolder): boolean;
    equalsValueWithTypeCast(value: ValueHolder): boolean;
}
export declare class Variable {
    id: number;
    name: string;
    holder: ValueHolder;
    static nextId: number;
    static defineBOOL(name: string, value?: boolean, id?: number): Variable;
    static defineNUMBER(name: string, value?: number, id?: number): Variable;
    static defineSTRING(name: string, value?: string, id?: number): Variable;
    constructor(id: number, name: string, holder: ValueHolder);
}
export declare class VariableStore {
    protected list: Variable[];
    constructor(list: Variable[]);
    findByName(varName: Variable['name']): Variable;
}
