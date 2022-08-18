function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

export var VarType;

(function (VarType) {
  VarType[VarType["BOOL"] = 0] = "BOOL";
  VarType[VarType["NUMBER"] = 1] = "NUMBER";
  VarType[VarType["STRING"] = 2] = "STRING";
})(VarType || (VarType = {}));

export var ValueHolder = /*#__PURE__*/function () {
  function ValueHolder(type, value) {
    _classCallCheck(this, ValueHolder);

    this.type = type;
    this.value = value;
  }

  _createClass(ValueHolder, [{
    key: "getType",
    value: function getType() {
      return this.type;
    }
  }, {
    key: "getRawValue",
    value: function getRawValue() {
      return this.value;
    }
  }, {
    key: "asBoolean",
    value: function asBoolean() {
      return this.value === true;
    }
  }, {
    key: "asNumber",
    value: function asNumber() {
      return parseFloat("".concat(this.value));
    }
  }, {
    key: "asString",
    value: function asString() {
      return "".concat(this.value);
    }
  }, {
    key: "cast",
    value: function cast(type) {
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
              return ValueHolder.newSTRING("".concat(this.asNumber()));
          }

          break;
      }

      return this;
    }
  }, {
    key: "equalsValueType",
    value: function equalsValueType(value) {
      return this.getType() === value.getType();
    }
  }, {
    key: "equalsValue",
    value: function equalsValue(value) {
      if (!this.equalsValueType(value)) return false;
      return this.value === value.getRawValue();
    }
  }, {
    key: "equalsValueWithTypeCast",
    value: function equalsValueWithTypeCast(value) {
      return this.cast(value.type).equalsValue(value);
    }
  }]);

  return ValueHolder;
}();

_defineProperty(ValueHolder, "newBOOL", function () {
  var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  return new ValueHolder(VarType.BOOL, v);
});

_defineProperty(ValueHolder, "newNUMBER", function () {
  var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  return new ValueHolder(VarType.NUMBER, v);
});

_defineProperty(ValueHolder, "newSTRING", function () {
  var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return new ValueHolder(VarType.STRING, v);
});

export var Variable = /*#__PURE__*/function () {
  function Variable(id, name, holder) {
    _classCallCheck(this, Variable);

    this.id = id;
    this.name = name;
    this.holder = holder;
  }

  _createClass(Variable, null, [{
    key: "defineBOOL",
    value: function defineBOOL(name) {
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var id = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ++this.nextId;
      return new Variable(id, name, ValueHolder.newBOOL(value));
    }
  }, {
    key: "defineNUMBER",
    value: function defineNUMBER(name) {
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var id = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ++this.nextId;
      return new Variable(id, name, ValueHolder.newNUMBER(value));
    }
  }, {
    key: "defineSTRING",
    value: function defineSTRING(name) {
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var id = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ++this.nextId;
      return new Variable(id, name, ValueHolder.newSTRING(value));
    }
  }]);

  return Variable;
}();

_defineProperty(Variable, "nextId", 0);

export var VariableStore = /*#__PURE__*/function () {
  function VariableStore(list) {
    _classCallCheck(this, VariableStore);

    this.list = list;
  }

  _createClass(VariableStore, [{
    key: "findByName",
    value: function findByName(varName) {
      return this.list.filter(function (_ref) {
        var name = _ref.name;
        return name === varName;
      })[0];
    }
  }]);

  return VariableStore;
}();