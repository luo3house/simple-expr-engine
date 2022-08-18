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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// 语法分析
import { Expr, Var, Op, Value, Rule } from '../core/grammar';
import { Morpheme } from './tokenizer';
import { ValueHolder } from '../core/variable';
export var ParseErrors;

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
})(ParseErrors || (ParseErrors = {}));

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
        if (!token) throw new ParseErrors.UnexpectedEOFError();
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

        if (token.morpheme === Morpheme.LEFT_BRACKET) {
          holder.setState(new ReadLeft());
          return;
        }

        throw new ParseErrors.UnexpectedMorphemeError(token);
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
          case Morpheme.LEFT_BRACKET:
            reader.rollback();
            expr.left = new ExprParser(ctx, reader).build();
            break;

          case Morpheme.VAR:
            expr.left = new Var(ctx, token.chars);
            break;

          case Morpheme.BOOL:
            expr.left = new Value(expr.context, ValueHolder.newBOOL(token.chars === 'true'));
            break;

          case Morpheme.NUMBER:
            expr.left = new Value(expr.context, ValueHolder.newNUMBER(parseFloat(token.chars)));
            break;

          case Morpheme.STRING:
            expr.left = new Value(expr.context, ValueHolder.newSTRING(token.unescapeSTRING()));
            break;

          default:
            throw new ParseErrors.UnexpectedMorphemeError(token);
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
          case Morpheme.RIGHT_BRACKET:
            holder.setState(new End());
            break;

          case Morpheme.OPERATOR:
            expr.op = new Op(expr.context, token.chars);
            break;

          default:
            throw new ParseErrors.UnexpectedMorphemeError(token);
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
          case Morpheme.LEFT_BRACKET:
            reader.rollback();
            expr.right = holder.buildExpr(expr.context, reader);
            break;

          case Morpheme.VAR:
            expr.right = new Var(ctx, token.chars);
            break;

          case Morpheme.BOOL:
            expr.right = new Value(expr.context, ValueHolder.newBOOL(token.chars === 'true'));
            break;

          case Morpheme.NUMBER:
            expr.right = new Value(expr.context, ValueHolder.newNUMBER(parseFloat(token.chars)));
            break;

          case Morpheme.STRING:
            expr.right = new Value(expr.context, ValueHolder.newSTRING(token.unescapeSTRING()));
            break;

          default:
            throw new ParseErrors.UnexpectedMorphemeError(token);
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
          case Morpheme.RIGHT_BRACKET:
            holder.setState(new End());
            break;

          case Morpheme.OPERATOR:
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
            throw new ParseErrors.UnexpectedMorphemeError(token);
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

export var ExprParser = /*#__PURE__*/function () {
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
        if (!token) throw new ParseErrors.UnexpectedEOFError();
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
          case Morpheme.LEFT_BRACKET:
            reader.rollback();
            rule.expr = new ExprParser(ctx, reader).build();
            holder.setState(new ReadArrow());
            break;

          default:
            throw new ParseErrors.UnexpectedMorphemeError(token);
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
          case Morpheme.RESULT_POINTING:
            holder.setState(new ReadResult());
            break;

          default:
            throw new ParseErrors.UnexpectedMorphemeError(token);
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
          case Morpheme.VAR:
            rule.result = new Var(ctx, token.chars);
            break;

          case Morpheme.BOOL:
            rule.result = new Value(ctx, ValueHolder.newBOOL(token.chars === 'true'));
            break;

          case Morpheme.NUMBER:
            rule.result = new Value(ctx, ValueHolder.newNUMBER(parseFloat(token.chars)));
            break;

          case Morpheme.STRING:
            rule.result = new Value(ctx, ValueHolder.newSTRING(token.unescapeSTRING()));
            break;

          default:
            throw new ParseErrors.UnexpectedMorphemeError(token);
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

export var RuleParser = /*#__PURE__*/function () {
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