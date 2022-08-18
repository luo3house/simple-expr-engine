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

import { Expr, Var, Value, Operator } from '../core/grammar';
export var SemanticErrors;

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
})(SemanticErrors || (SemanticErrors = {}));

export var Semantic = /*#__PURE__*/function () {
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
        if (!([Operator.AND, Operator.OR].indexOf(op.op) !== -1)) {
          throw new SemanticErrors.OpNotMatchError(op, left, right);
        }
      } else if (left.constructor === Var && right.constructor === Value || left.constructor === Var && right.constructor === Var) {
        if (!([Operator.EQ, Operator.NE, Operator.LT, Operator.GT, Operator.LTE, Operator.GTE].indexOf(op.op) !== -1)) {
          throw new SemanticErrors.OpNotMatchError(op, left, right);
        }
      }
    }
  }, {
    key: "matchVar",
    value: function matchVar(v) {
      if (!v.context.variableStore.findByName(v.name)) {
        throw new SemanticErrors.VariableNotFoundError(v.name);
      }
    }
  }]);

  return Semantic;
}();