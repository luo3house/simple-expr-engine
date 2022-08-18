function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

export var Operator;
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
})(Operator || (Operator = {}));

export var ExprGrammar;

(function (ExprGrammar) {
  ExprGrammar[ExprGrammar["Expr"] = 0] = "Expr";
  ExprGrammar[ExprGrammar["ExprOpExpr"] = 1] = "ExprOpExpr";
  ExprGrammar[ExprGrammar["ValueOpValue"] = 2] = "ValueOpValue";
})(ExprGrammar || (ExprGrammar = {}));

export var Rule = /*#__PURE__*/_createClass(function Rule(context) {
  _classCallCheck(this, Rule);

  this.context = context;
});
export var Expr = /*#__PURE__*/function () {
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
      if (left instanceof Expr && op === null && right === null) return ExprGrammar.Expr;
      if (left instanceof Expr && op !== null && right instanceof Expr) return ExprGrammar.ExprOpExpr;
      if (left instanceof Value && op !== null && right instanceof Value) return ExprGrammar.ValueOpValue;
      return null;
    }
  }]);

  return Expr;
}();
export var Op = /*#__PURE__*/_createClass(function Op(context, op) {
  _classCallCheck(this, Op);

  this.context = context;
  this.op = op;
});
export var Value = /*#__PURE__*/_createClass(function Value(context, valueHolder) {
  _classCallCheck(this, Value);

  this.context = context;
  this.valueHolder = valueHolder;
});
export var Var = /*#__PURE__*/function (_Value) {
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