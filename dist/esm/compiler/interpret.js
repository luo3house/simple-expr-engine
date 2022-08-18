function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct.bind(); } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

import { ExprGrammar, Operator } from '../core/grammar';
import { VarType } from '../core/variable';
export var InterpretErrors;

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
})(InterpretErrors || (InterpretErrors = {}));

var Interpretable;

(function (_Interpretable) {
  var ExprResult = /*#__PURE__*/function () {
    function ExprResult() {
      _classCallCheck(this, ExprResult);
    }

    _createClass(ExprResult, null, [{
      key: "result",
      value: function result(expr) {
        var context = expr.context,
            left = expr.left,
            op = expr.op,
            right = expr.right;

        switch (expr.getGrammar()) {
          case ExprGrammar.Expr:
            return ExprResult.result(left);

          case ExprGrammar.ExprOpExpr:
            return OpResult.resultExprOpExpr(op, left, right);

          case ExprGrammar.ValueOpValue:
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
          case Operator.AND:
            return ExprResult.result(left) && ExprResult.result(right);

          case Operator.OR:
            return ExprResult.result(left) || ExprResult.result(right);

          default:
            return false;
        }
      }
    }, {
      key: "resultValueValue",
      value: function resultValueValue(op, v1, v2) {
        switch (op.op) {
          case Operator.AND:
            return v1.valueHolder.cast(VarType.BOOL).asBoolean() && v2.valueHolder.cast(VarType.BOOL).asBoolean();

          case Operator.OR:
            return v1.valueHolder.cast(VarType.BOOL).asBoolean() || v2.valueHolder.cast(VarType.BOOL).asBoolean();

          case Operator.EQ:
            return v1.valueHolder.equalsValueWithTypeCast(v2.valueHolder);

          case Operator.NE:
            return !v1.valueHolder.equalsValueWithTypeCast(v2.valueHolder);

          case Operator.LT:
            return v1.valueHolder.asNumber() < v2.valueHolder.asNumber();

          case Operator.GT:
            return v1.valueHolder.asNumber() > v2.valueHolder.asNumber();

          case Operator.LTE:
            return v1.valueHolder.asNumber() <= v2.valueHolder.asNumber();

          case Operator.GTE:
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

export var Interpreter = /*#__PURE__*/function () {
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

      throw new InterpretErrors.NoRuleResultError();
    }
  }]);

  return Interpreter;
}();