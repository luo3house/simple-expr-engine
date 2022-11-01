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

// 词法分析
import { Operator } from '../core/grammar';
export var TokenizerErrors;

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
})(TokenizerErrors || (TokenizerErrors = {}));

export var Morpheme;

(function (Morpheme) {
  Morpheme[Morpheme["LEFT_BRACKET"] = 0] = "LEFT_BRACKET";
  Morpheme[Morpheme["RIGHT_BRACKET"] = 1] = "RIGHT_BRACKET";
  Morpheme[Morpheme["VAR"] = 2] = "VAR";
  Morpheme[Morpheme["OPERATOR"] = 3] = "OPERATOR";
  Morpheme[Morpheme["RESULT_POINTING"] = 4] = "RESULT_POINTING";
  Morpheme[Morpheme["BOOL"] = 5] = "BOOL";
  Morpheme[Morpheme["NUMBER"] = 6] = "NUMBER";
  Morpheme[Morpheme["STRING"] = 7] = "STRING";
})(Morpheme || (Morpheme = {}));

var LEFT_BRACKET = Morpheme.LEFT_BRACKET,
    RIGHT_BRACKET = Morpheme.RIGHT_BRACKET,
    VAR = Morpheme.VAR,
    RESULT_POINTING = Morpheme.RESULT_POINTING,
    BOOL = Morpheme.BOOL,
    NUMBER = Morpheme.NUMBER,
    STRING = Morpheme.STRING,
    OPERATOR = Morpheme.OPERATOR;
export var Token = /*#__PURE__*/function () {
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

      throw new TokenizerErrors.TokenNotRecognizeError(tkn);
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
  return /^(and)$/.test(c) && new Token(OPERATOR, Operator.AND);
}, function (c) {
  return /^(or)$/.test(c) && new Token(OPERATOR, Operator.OR);
}, function (c) {
  return /^(=>)$/.test(c) && new Token(RESULT_POINTING, c);
}, function (c) {
  return /^(!=)$/.test(c) && new Token(OPERATOR, Operator.NE);
}, function (c) {
  return /^(<=)$/.test(c) && new Token(OPERATOR, Operator.LTE);
}, function (c) {
  return /^(>=)$/.test(c) && new Token(OPERATOR, Operator.GTE);
}, function (c) {
  return /^(==)$/.test(c) && new Token(OPERATOR, Operator.EQ);
}, function (c) {
  return /^(<)$/.test(c) && new Token(OPERATOR, Operator.LT);
}, function (c) {
  return /^(>)$/.test(c) && new Token(OPERATOR, Operator.GT);
}, function (c) {
  return /^(-{0,1}[0-9]+(\.[0-9]+){0,1})$/.test(c) && new Token(NUMBER, c);
}, function (c) {
  return /^(true|false)$/.test(c) && new Token(BOOL, c);
}, function (c) {
  return /^"(([^"])*)"$/.test(c) && new Token(STRING, c);
}, function (c) {
  return /^(([a-zA-Z]|_)((\w|_)*))$/.test(c) && new Token(VAR, c);
}]);