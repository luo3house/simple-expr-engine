function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

import { ExprParser, RuleParser } from './parse';
import { Token } from './tokenizer';
export var Facade = /*#__PURE__*/function () {
  function Facade() {
    _classCallCheck(this, Facade);
  }

  _createClass(Facade, null, [{
    key: "buildRules",
    value: function buildRules(context, ruleSources) {
      var rules = [];
      ruleSources.forEach(function (ruleSource) {
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