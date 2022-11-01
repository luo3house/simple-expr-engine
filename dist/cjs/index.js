'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct.bind();
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }

  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

exports.Operator = void 0;
/*

  rule -> ( expr ) => value
  expr -> ( expr )
  expr -> ( expr op expr )
  expr -> ( value op value )
  op -> and | or | == | != | < | > | <= | >=
  value -> BOOL | "String" | NUMBER | var
  var -> String

*/

(function (Operator) {
  Operator["AND"] = "and";
  Operator["OR"] = "or";
  Operator["EQ"] = "==";
  Operator["NE"] = "!=";
  Operator["LT"] = "<";
  Operator["GT"] = ">";
  Operator["LTE"] = "<=";
  Operator["GTE"] = ">=";
})(exports.Operator || (exports.Operator = {}));

exports.ExprGrammar = void 0;

(function (ExprGrammar) {
  ExprGrammar[ExprGrammar["Expr"] = 0] = "Expr";
  ExprGrammar[ExprGrammar["ExprOpExpr"] = 1] = "ExprOpExpr";
  ExprGrammar[ExprGrammar["ValueOpValue"] = 2] = "ValueOpValue";
})(exports.ExprGrammar || (exports.ExprGrammar = {}));

var Rule = /*#__PURE__*/_createClass(function Rule(context) {
  _classCallCheck(this, Rule);

  this.context = context;
});
var Expr = /*#__PURE__*/function () {
  function Expr(context) {
    _classCallCheck(this, Expr);

    this.context = context;
  }

  _createClass(Expr, [{
    key: "getGrammar",
    value: function getGrammar() {
      var left = this.left,
          op = this.op,
          right = this.right;
      if (left instanceof Expr && op === null && right === null) return exports.ExprGrammar.Expr;
      if (left instanceof Expr && op !== null && right instanceof Expr) return exports.ExprGrammar.ExprOpExpr;
      if (left instanceof Value && op !== null && right instanceof Value) return exports.ExprGrammar.ValueOpValue;
      return null;
    }
  }]);

  return Expr;
}();
var Op = /*#__PURE__*/_createClass(function Op(context, op) {
  _classCallCheck(this, Op);

  this.context = context;
  this.op = op;
});
var Value = /*#__PURE__*/_createClass(function Value(context, valueHolder) {
  _classCallCheck(this, Value);

  this.context = context;
  this.valueHolder = valueHolder;
});
var Var = /*#__PURE__*/function (_Value) {
  _inherits(Var, _Value);

  var _super = _createSuper(Var);

  function Var(context, name) {
    var _this;

    _classCallCheck(this, Var);

    _this = _super.call(this, context, context.variableStore.findByName(name).holder);
    _this.context = context;
    _this.name = name;
    return _this;
  }

  return _createClass(Var);
}(Value);

exports.VarType = void 0;

(function (VarType) {
  VarType[VarType["BOOL"] = 0] = "BOOL";
  VarType[VarType["NUMBER"] = 1] = "NUMBER";
  VarType[VarType["STRING"] = 2] = "STRING";
})(exports.VarType || (exports.VarType = {}));

var ValueHolder = /*#__PURE__*/function () {
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
        case exports.VarType.BOOL:
          switch (this.type) {
            case exports.VarType.NUMBER:
              return ValueHolder.newBOOL(this.asNumber() !== 0);

            case exports.VarType.STRING:
              return ValueHolder.newBOOL(this.asString().length > 0);
          }

          break;

        case exports.VarType.NUMBER:
          switch (this.type) {
            case exports.VarType.BOOL:
              return ValueHolder.newNUMBER(this.asBoolean() ? 1 : 0);

            case exports.VarType.STRING:
              return ValueHolder.newNUMBER(this.asNumber());
          }

          break;

        case exports.VarType.STRING:
          switch (this.type) {
            case exports.VarType.BOOL:
              return ValueHolder.newSTRING(this.asBoolean() ? 'true' : 'false');

            case exports.VarType.NUMBER:
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
  return new ValueHolder(exports.VarType.BOOL, v);
});

_defineProperty(ValueHolder, "newNUMBER", function () {
  var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  return new ValueHolder(exports.VarType.NUMBER, v);
});

_defineProperty(ValueHolder, "newSTRING", function () {
  var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return new ValueHolder(exports.VarType.STRING, v);
});

var Variable = /*#__PURE__*/function () {
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

var VariableStore = /*#__PURE__*/function () {
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

exports.TokenizerErrors = void 0;

(function (_TokenizerErrors) {
  var TokenNotRecognizeError = /*#__PURE__*/function (_Error) {
    _inherits(TokenNotRecognizeError, _Error);

    var _super = _createSuper(TokenNotRecognizeError);

    function TokenNotRecognizeError(chars) {
      _classCallCheck(this, TokenNotRecognizeError);

      return _super.call(this, "unrecognized token: ".concat(chars));
    }

    return _createClass(TokenNotRecognizeError);
  }( /*#__PURE__*/_wrapNativeSuper(Error));

  _TokenizerErrors.TokenNotRecognizeError = TokenNotRecognizeError;
})(exports.TokenizerErrors || (exports.TokenizerErrors = {}));

exports.Morpheme = void 0;

(function (Morpheme) {
  Morpheme[Morpheme["LEFT_BRACKET"] = 0] = "LEFT_BRACKET";
  Morpheme[Morpheme["RIGHT_BRACKET"] = 1] = "RIGHT_BRACKET";
  Morpheme[Morpheme["VAR"] = 2] = "VAR";
  Morpheme[Morpheme["OPERATOR"] = 3] = "OPERATOR";
  Morpheme[Morpheme["RESULT_POINTING"] = 4] = "RESULT_POINTING";
  Morpheme[Morpheme["BOOL"] = 5] = "BOOL";
  Morpheme[Morpheme["NUMBER"] = 6] = "NUMBER";
  Morpheme[Morpheme["STRING"] = 7] = "STRING";
})(exports.Morpheme || (exports.Morpheme = {}));

var LEFT_BRACKET = exports.Morpheme.LEFT_BRACKET,
    RIGHT_BRACKET = exports.Morpheme.RIGHT_BRACKET,
    VAR = exports.Morpheme.VAR,
    RESULT_POINTING = exports.Morpheme.RESULT_POINTING,
    BOOL = exports.Morpheme.BOOL,
    NUMBER = exports.Morpheme.NUMBER,
    STRING = exports.Morpheme.STRING,
    OPERATOR = exports.Morpheme.OPERATOR;
var Token = /*#__PURE__*/function () {
  function Token(morpheme) {
    var chars = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    _classCallCheck(this, Token);

    this.morpheme = morpheme;
    this.chars = chars;
  }

  _createClass(Token, [{
    key: "unescapeSTRING",
    value: function unescapeSTRING() {
      var seq = this.chars.split('');
      seq.shift();
      seq.pop();
      return seq.join('');
    }
  }, {
    key: "toString",
    value: function toString() {
      return "Token<".concat(this.morpheme, ",").concat(this.chars, ">");
    }
  }], [{
    key: "newReader",
    value: function newReader(tokens) {
      return new ( /*#__PURE__*/function () {
        function _class2() {
          var _this = this;

          _classCallCheck(this, _class2);

          _defineProperty(this, "charsReaded", []);

          _defineProperty(this, "offset", 0);

          _defineProperty(this, "getCharsReaded", function () {
            return _this.charsReaded.join(' ');
          });
        }

        _createClass(_class2, [{
          key: "read",
          value: function read() {
            var _tokens$this$offset;

            var token = (_tokens$this$offset = tokens[this.offset]) !== null && _tokens$this$offset !== void 0 ? _tokens$this$offset : null;

            if (token) {
              this.offset++;
              this.charsReaded.push(token.chars);
            }

            return token;
          }
        }, {
          key: "rollback",
          value: function rollback() {
            this.charsReaded.pop();
            this.offset--;
          }
        }]);

        return _class2;
      }())();
    }
  }, {
    key: "recognize",
    value: function recognize(tkn) {
      for (var i = 0; i < this.TokenRecognizers.length; i++) {
        var token = this.TokenRecognizers[i](tkn);

        if (token !== false) {
          return token;
        }
      }

      throw new exports.TokenizerErrors.TokenNotRecognizeError(tkn);
    }
  }, {
    key: "recognizeAll",
    value: function recognizeAll(characters) {
      var tokens = [];

      for (var i = 0; i < characters.length; i++) {
        if (!characters[i]) continue;
        tokens.push(Token.recognize(characters[i]));
      }

      return tokens;
    }
  }, {
    key: "escapeStringCharacters",
    value: function escapeStringCharacters(characters) {
      var escaped = [];
      var concatChars = [];

      var flushConcatChars = function flushConcatChars() {
        var concated = concatChars.join('').trim();
        if (concated.length) escaped.push(concated);
        concatChars = [];
      };

      for (var i = 0; i < characters.length; i++) {
        var _char = characters[i];

        if (concatChars[0] === "\"") {
          concatChars.push(_char);
          if (_char === "\"") flushConcatChars(); // end string quote
        } else if (_char === ' ') {
          flushConcatChars();
        } else {
          if (_char === "\"") {
            flushConcatChars(); // start string quote
          }

          concatChars.push(_char);
        }
      }

      flushConcatChars();
      return escaped;
    }
  }]);

  return Token;
}();

_defineProperty(Token, "TokenRecognizers", [function (c) {
  return /^(\()$/.test(c) && new Token(LEFT_BRACKET, c);
}, function (c) {
  return /^\)$/.test(c) && new Token(RIGHT_BRACKET, c);
}, function (c) {
  return /^(and)$/.test(c) && new Token(OPERATOR, exports.Operator.AND);
}, function (c) {
  return /^(or)$/.test(c) && new Token(OPERATOR, exports.Operator.OR);
}, function (c) {
  return /^(=>)$/.test(c) && new Token(RESULT_POINTING, c);
}, function (c) {
  return /^(!=)$/.test(c) && new Token(OPERATOR, exports.Operator.NE);
}, function (c) {
  return /^(<=)$/.test(c) && new Token(OPERATOR, exports.Operator.LTE);
}, function (c) {
  return /^(>=)$/.test(c) && new Token(OPERATOR, exports.Operator.GTE);
}, function (c) {
  return /^(==)$/.test(c) && new Token(OPERATOR, exports.Operator.EQ);
}, function (c) {
  return /^(<)$/.test(c) && new Token(OPERATOR, exports.Operator.LT);
}, function (c) {
  return /^(>)$/.test(c) && new Token(OPERATOR, exports.Operator.GT);
}, function (c) {
  return /^(-{0,1}[0-9]+(\.[0-9]+){0,1})$/.test(c) && new Token(NUMBER, c);
}, function (c) {
  return /^(true|false)$/.test(c) && new Token(BOOL, c);
}, function (c) {
  return /^"(([^"])*)"$/.test(c) && new Token(STRING, c);
}, function (c) {
  return /^(([a-zA-Z]|_)((\w|_)*))$/.test(c) && new Token(VAR, c);
}]);

exports.ParseErrors = void 0;

(function (_ParseErrors) {
  var UnexpectedMorphemeError = /*#__PURE__*/function (_Error) {
    _inherits(UnexpectedMorphemeError, _Error);

    var _super = _createSuper(UnexpectedMorphemeError);

    function UnexpectedMorphemeError(token) {
      var _this;

      _classCallCheck(this, UnexpectedMorphemeError);

      _this = _super.call(this, "unexpected morpheme ".concat(token.toString()));
      _this.token = token;
      return _this;
    }

    return _createClass(UnexpectedMorphemeError);
  }( /*#__PURE__*/_wrapNativeSuper(Error));

  _ParseErrors.UnexpectedMorphemeError = UnexpectedMorphemeError;

  var UnexpectedEOFError = /*#__PURE__*/function (_Error2) {
    _inherits(UnexpectedEOFError, _Error2);

    var _super2 = _createSuper(UnexpectedEOFError);

    function UnexpectedEOFError() {
      _classCallCheck(this, UnexpectedEOFError);

      return _super2.call(this, "unexpected EOF");
    }

    return _createClass(UnexpectedEOFError);
  }( /*#__PURE__*/_wrapNativeSuper(Error));

  _ParseErrors.UnexpectedEOFError = UnexpectedEOFError;
})(exports.ParseErrors || (exports.ParseErrors = {}));

var ExprParseState;

(function (_ExprParseState) {
  var BaseState = /*#__PURE__*/function () {
    function BaseState() {
      _classCallCheck(this, BaseState);
    }

    _createClass(BaseState, [{
      key: "mustReadToken",
      value: function mustReadToken(reader) {
        var token = reader.read();
        if (!token) throw new exports.ParseErrors.UnexpectedEOFError();
        return token;
      }
    }]);

    return BaseState;
  }();

  _ExprParseState.BaseState = BaseState;

  var Begin = /*#__PURE__*/function (_BaseState) {
    _inherits(Begin, _BaseState);

    var _super3 = _createSuper(Begin);

    function Begin() {
      _classCallCheck(this, Begin);

      return _super3.apply(this, arguments);
    }

    _createClass(Begin, [{
      key: "build",
      value: function build(ctx, expr, reader, holder) {
        holder.setState(new ReadLeftBracket());
      }
    }]);

    return Begin;
  }(BaseState);

  _ExprParseState.Begin = Begin;

  var ReadLeftBracket = /*#__PURE__*/function (_BaseState2) {
    _inherits(ReadLeftBracket, _BaseState2);

    var _super4 = _createSuper(ReadLeftBracket);

    function ReadLeftBracket() {
      _classCallCheck(this, ReadLeftBracket);

      return _super4.apply(this, arguments);
    }

    _createClass(ReadLeftBracket, [{
      key: "build",
      value: function build(ctx, expr, reader, holder) {
        var token = this.mustReadToken(reader);

        if (token.morpheme === exports.Morpheme.LEFT_BRACKET) {
          holder.setState(new ReadLeft());
          return;
        }

        throw new exports.ParseErrors.UnexpectedMorphemeError(token);
      }
    }]);

    return ReadLeftBracket;
  }(BaseState);

  _ExprParseState.ReadLeftBracket = ReadLeftBracket;

  var ReadLeft = /*#__PURE__*/function (_BaseState3) {
    _inherits(ReadLeft, _BaseState3);

    var _super5 = _createSuper(ReadLeft);

    function ReadLeft() {
      _classCallCheck(this, ReadLeft);

      return _super5.apply(this, arguments);
    }

    _createClass(ReadLeft, [{
      key: "build",
      value: function build(ctx, expr, reader, holder) {
        var token = this.mustReadToken(reader);

        switch (token.morpheme) {
          case exports.Morpheme.LEFT_BRACKET:
            reader.rollback();
            expr.left = new ExprParser(ctx, reader).build();
            break;

          case exports.Morpheme.VAR:
            expr.left = new Var(ctx, token.chars);
            break;

          case exports.Morpheme.BOOL:
            expr.left = new Value(expr.context, ValueHolder.newBOOL(token.chars === 'true'));
            break;

          case exports.Morpheme.NUMBER:
            expr.left = new Value(expr.context, ValueHolder.newNUMBER(parseFloat(token.chars)));
            break;

          case exports.Morpheme.STRING:
            expr.left = new Value(expr.context, ValueHolder.newSTRING(token.unescapeSTRING()));
            break;

          default:
            throw new exports.ParseErrors.UnexpectedMorphemeError(token);
        }

        holder.setState(new ReadOp());
      }
    }]);

    return ReadLeft;
  }(BaseState);

  _ExprParseState.ReadLeft = ReadLeft;

  var ReadOp = /*#__PURE__*/function (_BaseState4) {
    _inherits(ReadOp, _BaseState4);

    var _super6 = _createSuper(ReadOp);

    function ReadOp() {
      _classCallCheck(this, ReadOp);

      return _super6.apply(this, arguments);
    }

    _createClass(ReadOp, [{
      key: "build",
      value: function build(ctx, expr, reader, holder) {
        var token = this.mustReadToken(reader);

        switch (token.morpheme) {
          case exports.Morpheme.RIGHT_BRACKET:
            holder.setState(new End());
            break;

          case exports.Morpheme.OPERATOR:
            expr.op = new Op(expr.context, token.chars);
            break;

          default:
            throw new exports.ParseErrors.UnexpectedMorphemeError(token);
        }

        holder.setState(new ReadRight());
      }
    }]);

    return ReadOp;
  }(BaseState);

  _ExprParseState.ReadOp = ReadOp;

  var ReadRight = /*#__PURE__*/function (_BaseState5) {
    _inherits(ReadRight, _BaseState5);

    var _super7 = _createSuper(ReadRight);

    function ReadRight() {
      _classCallCheck(this, ReadRight);

      return _super7.apply(this, arguments);
    }

    _createClass(ReadRight, [{
      key: "build",
      value: function build(ctx, expr, reader, holder) {
        var token = this.mustReadToken(reader);

        switch (token.morpheme) {
          case exports.Morpheme.LEFT_BRACKET:
            reader.rollback();
            expr.right = holder.buildExpr(expr.context, reader);
            break;

          case exports.Morpheme.VAR:
            expr.right = new Var(ctx, token.chars);
            break;

          case exports.Morpheme.BOOL:
            expr.right = new Value(expr.context, ValueHolder.newBOOL(token.chars === 'true'));
            break;

          case exports.Morpheme.NUMBER:
            expr.right = new Value(expr.context, ValueHolder.newNUMBER(parseFloat(token.chars)));
            break;

          case exports.Morpheme.STRING:
            expr.right = new Value(expr.context, ValueHolder.newSTRING(token.unescapeSTRING()));
            break;

          default:
            throw new exports.ParseErrors.UnexpectedMorphemeError(token);
        }

        holder.setState(new ReadRightBracket());
      }
    }]);

    return ReadRight;
  }(BaseState);

  _ExprParseState.ReadRight = ReadRight;

  var ReadRightBracket = /*#__PURE__*/function (_BaseState6) {
    _inherits(ReadRightBracket, _BaseState6);

    var _super8 = _createSuper(ReadRightBracket);

    function ReadRightBracket() {
      _classCallCheck(this, ReadRightBracket);

      return _super8.apply(this, arguments);
    }

    _createClass(ReadRightBracket, [{
      key: "build",
      value: function build(ctx, expr, reader, holder) {
        var token = this.mustReadToken(reader);

        switch (token.morpheme) {
          case exports.Morpheme.RIGHT_BRACKET:
            holder.setState(new End());
            break;

          case exports.Morpheme.OPERATOR:
            // a op b op c -> ( a op b ) op c
            var newExpr = new Expr(ctx);
            newExpr.left = expr.left;
            newExpr.op = expr.op;
            newExpr.right = expr.right;
            expr.left = newExpr;
            expr.right = null;
            reader.rollback();
            holder.setState(new ReadOp());
            break;

          default:
            throw new exports.ParseErrors.UnexpectedMorphemeError(token);
        }
      }
    }]);

    return ReadRightBracket;
  }(BaseState);

  _ExprParseState.ReadRightBracket = ReadRightBracket;

  var End = /*#__PURE__*/function (_BaseState7) {
    _inherits(End, _BaseState7);

    var _super9 = _createSuper(End);

    function End() {
      _classCallCheck(this, End);

      return _super9.apply(this, arguments);
    }

    _createClass(End, [{
      key: "build",
      value: function build(ctx, expr, reader, holder) {}
    }]);

    return End;
  }(BaseState);

  _ExprParseState.End = End;
})(ExprParseState || (ExprParseState = {}));

var ExprParser = /*#__PURE__*/function () {
  function ExprParser(context, reader) {
    _classCallCheck(this, ExprParser);

    _defineProperty(this, "state", new ExprParseState.Begin());

    this.context = context;
    this.reader = reader;
    this.expr = new Expr(context);
  }

  _createClass(ExprParser, [{
    key: "buildExpr",
    value: function buildExpr(ctx, reader) {
      return new ExprParser(ctx, reader).build();
    }
  }, {
    key: "setState",
    value: function setState(state) {
      this.state = state;
    }
  }, {
    key: "build",
    value: function build() {
      var complete = false;

      while (!complete) {
        this.state.build(this.context, this.expr, this.reader, this);

        if (this.state.constructor === ExprParseState.End) {
          complete = true;
          break;
        }
      }

      return this.expr;
    }
  }]);

  return ExprParser;
}();
var RuleParseState;

(function (_RuleParseState) {
  var BaseState = /*#__PURE__*/function () {
    function BaseState() {
      _classCallCheck(this, BaseState);
    }

    _createClass(BaseState, [{
      key: "mustReadToken",
      value: function mustReadToken(reader) {
        var token = reader.read();
        if (!token) throw new exports.ParseErrors.UnexpectedEOFError();
        return token;
      }
    }]);

    return BaseState;
  }();

  _RuleParseState.BaseState = BaseState;

  var Begin = /*#__PURE__*/function (_BaseState8) {
    _inherits(Begin, _BaseState8);

    var _super10 = _createSuper(Begin);

    function Begin() {
      _classCallCheck(this, Begin);

      return _super10.apply(this, arguments);
    }

    _createClass(Begin, [{
      key: "build",
      value: function build(ctx, rule, reader, holder) {
        var token = this.mustReadToken(reader);

        switch (token.morpheme) {
          case exports.Morpheme.LEFT_BRACKET:
            reader.rollback();
            rule.expr = new ExprParser(ctx, reader).build();
            holder.setState(new ReadArrow());
            break;

          default:
            throw new exports.ParseErrors.UnexpectedMorphemeError(token);
        }
      }
    }]);

    return Begin;
  }(BaseState);

  _RuleParseState.Begin = Begin;

  var ReadArrow = /*#__PURE__*/function (_BaseState9) {
    _inherits(ReadArrow, _BaseState9);

    var _super11 = _createSuper(ReadArrow);

    function ReadArrow() {
      _classCallCheck(this, ReadArrow);

      return _super11.apply(this, arguments);
    }

    _createClass(ReadArrow, [{
      key: "build",
      value: function build(ctx, rule, reader, holder) {
        var token = this.mustReadToken(reader);

        switch (token.morpheme) {
          case exports.Morpheme.RESULT_POINTING:
            holder.setState(new ReadResult());
            break;

          default:
            throw new exports.ParseErrors.UnexpectedMorphemeError(token);
        }
      }
    }]);

    return ReadArrow;
  }(BaseState);

  _RuleParseState.ReadArrow = ReadArrow;

  var ReadResult = /*#__PURE__*/function (_BaseState10) {
    _inherits(ReadResult, _BaseState10);

    var _super12 = _createSuper(ReadResult);

    function ReadResult() {
      _classCallCheck(this, ReadResult);

      return _super12.apply(this, arguments);
    }

    _createClass(ReadResult, [{
      key: "build",
      value: function build(ctx, rule, reader, holder) {
        var token = this.mustReadToken(reader);

        switch (token.morpheme) {
          case exports.Morpheme.VAR:
            rule.result = new Var(ctx, token.chars);
            break;

          case exports.Morpheme.BOOL:
            rule.result = new Value(ctx, ValueHolder.newBOOL(token.chars === 'true'));
            break;

          case exports.Morpheme.NUMBER:
            rule.result = new Value(ctx, ValueHolder.newNUMBER(parseFloat(token.chars)));
            break;

          case exports.Morpheme.STRING:
            rule.result = new Value(ctx, ValueHolder.newSTRING(token.unescapeSTRING()));
            break;

          default:
            throw new exports.ParseErrors.UnexpectedMorphemeError(token);
        }

        holder.setState(new End());
      }
    }]);

    return ReadResult;
  }(BaseState);

  _RuleParseState.ReadResult = ReadResult;

  var End = /*#__PURE__*/function (_BaseState11) {
    _inherits(End, _BaseState11);

    var _super13 = _createSuper(End);

    function End() {
      _classCallCheck(this, End);

      return _super13.apply(this, arguments);
    }

    _createClass(End, [{
      key: "build",
      value: function build(ctx, rule, reader, holder) {}
    }]);

    return End;
  }(BaseState);

  _RuleParseState.End = End;
})(RuleParseState || (RuleParseState = {}));

var RuleParser = /*#__PURE__*/function () {
  function RuleParser(context, reader) {
    _classCallCheck(this, RuleParser);

    _defineProperty(this, "state", new RuleParseState.Begin());

    this.context = context;
    this.reader = reader;
    this.rule = new Rule(context);
  }

  _createClass(RuleParser, [{
    key: "setState",
    value: function setState(state) {
      this.state = state;
    }
  }, {
    key: "build",
    value: function build() {
      var complete = false;

      while (!complete) {
        this.state.build(this.context, this.rule, this.reader, this);

        if (this.state.constructor === RuleParseState.End) {
          complete = true;
          break;
        }
      }

      return this.rule;
    }
  }]);

  return RuleParser;
}();

var Facade = /*#__PURE__*/function () {
  function Facade() {
    _classCallCheck(this, Facade);
  }

  _createClass(Facade, null, [{
    key: "buildRules",
    value: function buildRules(context, ruleSources) {
      var rules = [];
      ruleSources.forEach(function (ruleSource) {
        if (!ruleSource) return;
        var characters = Token.escapeStringCharacters(ruleSource.split(''));
        rules.push(new RuleParser(context, Token.newReader(Token.recognizeAll(characters))).build());
      });
      return rules;
    }
  }, {
    key: "buildExpr",
    value: function buildExpr(context, exprSource) {
      var characters = Token.escapeStringCharacters(exprSource.split(''));
      return new ExprParser(context, Token.newReader(Token.recognizeAll(characters))).build();
    }
  }]);

  return Facade;
}();

exports.InterpretErrors = void 0;

(function (_InterpretErrors) {
  var NoRuleResultError = /*#__PURE__*/function (_Error) {
    _inherits(NoRuleResultError, _Error);

    var _super = _createSuper(NoRuleResultError);

    function NoRuleResultError() {
      _classCallCheck(this, NoRuleResultError);

      return _super.call(this, "no rule result is return out");
    }

    return _createClass(NoRuleResultError);
  }( /*#__PURE__*/_wrapNativeSuper(Error));

  _InterpretErrors.NoRuleResultError = NoRuleResultError;
})(exports.InterpretErrors || (exports.InterpretErrors = {}));

var Interpretable;

(function (_Interpretable) {
  var ExprResult = /*#__PURE__*/function () {
    function ExprResult() {
      _classCallCheck(this, ExprResult);
    }

    _createClass(ExprResult, null, [{
      key: "result",
      value: function result(expr) {
        expr.context;
            var left = expr.left,
            op = expr.op,
            right = expr.right;

        switch (expr.getGrammar()) {
          case exports.ExprGrammar.Expr:
            return ExprResult.result(left);

          case exports.ExprGrammar.ExprOpExpr:
            return OpResult.resultExprOpExpr(op, left, right);

          case exports.ExprGrammar.ValueOpValue:
            return OpResult.resultValueValue(op, left, right);

          default:
            return false;
        }
      }
    }]);

    return ExprResult;
  }();

  _Interpretable.ExprResult = ExprResult;

  var OpResult = /*#__PURE__*/function () {
    function OpResult() {
      _classCallCheck(this, OpResult);
    }

    _createClass(OpResult, null, [{
      key: "resultExprOpExpr",
      value: function resultExprOpExpr(op, left, right) {
        switch (op.op) {
          case exports.Operator.AND:
            return ExprResult.result(left) && ExprResult.result(right);

          case exports.Operator.OR:
            return ExprResult.result(left) || ExprResult.result(right);

          default:
            return false;
        }
      }
    }, {
      key: "resultValueValue",
      value: function resultValueValue(op, v1, v2) {
        switch (op.op) {
          case exports.Operator.AND:
            return v1.valueHolder.cast(exports.VarType.BOOL).asBoolean() && v2.valueHolder.cast(exports.VarType.BOOL).asBoolean();

          case exports.Operator.OR:
            return v1.valueHolder.cast(exports.VarType.BOOL).asBoolean() || v2.valueHolder.cast(exports.VarType.BOOL).asBoolean();

          case exports.Operator.EQ:
            return v1.valueHolder.equalsValueWithTypeCast(v2.valueHolder);

          case exports.Operator.NE:
            return !v1.valueHolder.equalsValueWithTypeCast(v2.valueHolder);

          case exports.Operator.LT:
            return v1.valueHolder.asNumber() < v2.valueHolder.asNumber();

          case exports.Operator.GT:
            return v1.valueHolder.asNumber() > v2.valueHolder.asNumber();

          case exports.Operator.LTE:
            return v1.valueHolder.asNumber() <= v2.valueHolder.asNumber();

          case exports.Operator.GTE:
            return v1.valueHolder.asNumber() >= v2.valueHolder.asNumber();

          default:
            return false;
        }
      }
    }]);

    return OpResult;
  }();

  _Interpretable.OpResult = OpResult;
})(Interpretable || (Interpretable = {}));

var Interpreter = /*#__PURE__*/function () {
  function Interpreter() {
    _classCallCheck(this, Interpreter);
  }

  _createClass(Interpreter, null, [{
    key: "interpretExpr",
    value: function interpretExpr(expr) {
      return Interpretable.ExprResult.result(expr);
    }
  }, {
    key: "interpretRules",
    value: function interpretRules(rules) {
      for (var i = 0; i < rules.length; i++) {
        var rule = rules[i];

        if (this.interpretExpr(rule.expr)) {
          return rule.result;
        }
      }

      throw new exports.InterpretErrors.NoRuleResultError();
    }
  }]);

  return Interpreter;
}();

exports.SemanticErrors = void 0;

(function (_SemanticErrors) {
  var OpNotMatchError = /*#__PURE__*/function (_Error) {
    _inherits(OpNotMatchError, _Error);

    var _super = _createSuper(OpNotMatchError);

    function OpNotMatchError(op, left, right) {
      var _this;

      _classCallCheck(this, OpNotMatchError);

      _this = _super.call(this, "op is not match at ( left op right ): (".concat(left, " ").concat(op, " ").concat(right, ")"));
      _this.op = op;
      _this.left = left;
      _this.right = right;
      return _this;
    }

    return _createClass(OpNotMatchError);
  }( /*#__PURE__*/_wrapNativeSuper(Error));

  _SemanticErrors.OpNotMatchError = OpNotMatchError;

  var VariableNotFoundError = /*#__PURE__*/function (_Error2) {
    _inherits(VariableNotFoundError, _Error2);

    var _super2 = _createSuper(VariableNotFoundError);

    function VariableNotFoundError(name) {
      _classCallCheck(this, VariableNotFoundError);

      return _super2.call(this, "variable ".concat(name, " not found"));
    }

    return _createClass(VariableNotFoundError);
  }( /*#__PURE__*/_wrapNativeSuper(Error));

  _SemanticErrors.VariableNotFoundError = VariableNotFoundError;
})(exports.SemanticErrors || (exports.SemanticErrors = {}));

var Semantic = /*#__PURE__*/function () {
  function Semantic() {
    _classCallCheck(this, Semantic);
  }

  _createClass(Semantic, [{
    key: "matchExpr",
    value: function matchExpr(expr) {
      var left = expr.left,
          op = expr.op,
          right = expr.right;

      if ((left === null || left === void 0 ? void 0 : left.constructor) === Expr && (right === null || right === void 0 ? void 0 : right.constructor) === Expr || (left === null || left === void 0 ? void 0 : left.constructor) === Var && (right === null || right === void 0 ? void 0 : right.constructor) === Value || (left === null || left === void 0 ? void 0 : left.constructor) === Var && (right === null || right === void 0 ? void 0 : right.constructor) === Var) {
        this.matchOp(op, left, right);

        if ((left === null || left === void 0 ? void 0 : left.constructor) === Var) {
          this.matchVar(left);
        }

        if ((right === null || right === void 0 ? void 0 : right.constructor) === Var) {
          this.matchVar(right);
        }
      } else if ((left === null || left === void 0 ? void 0 : left.constructor) === Expr && op === null && right === null) {
        this.matchExpr(left);
      } else {
        return false;
      }
    }
  }, {
    key: "matchOp",
    value: function matchOp(op, left, right) {
      if (left.constructor === Expr && right.constructor === Expr) {
        if (!([exports.Operator.AND, exports.Operator.OR].indexOf(op.op) !== -1)) {
          throw new exports.SemanticErrors.OpNotMatchError(op, left, right);
        }
      } else if (left.constructor === Var && right.constructor === Value || left.constructor === Var && right.constructor === Var) {
        if (!([exports.Operator.EQ, exports.Operator.NE, exports.Operator.LT, exports.Operator.GT, exports.Operator.LTE, exports.Operator.GTE].indexOf(op.op) !== -1)) {
          throw new exports.SemanticErrors.OpNotMatchError(op, left, right);
        }
      }
    }
  }, {
    key: "matchVar",
    value: function matchVar(v) {
      if (!v.context.variableStore.findByName(v.name)) {
        throw new exports.SemanticErrors.VariableNotFoundError(v.name);
      }
    }
  }]);

  return Semantic;
}();

exports.Expr = Expr;
exports.ExprParser = ExprParser;
exports.Facade = Facade;
exports.Interpreter = Interpreter;
exports.Op = Op;
exports.Rule = Rule;
exports.RuleParser = RuleParser;
exports.Semantic = Semantic;
exports.Token = Token;
exports.Value = Value;
exports.ValueHolder = ValueHolder;
exports.Var = Var;
exports.Variable = Variable;
exports.VariableStore = VariableStore;
