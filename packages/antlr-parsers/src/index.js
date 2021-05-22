import antlr4 from 'antlr4';
import * as c3 from 'antlr4-c3';
import FilterParser from '../generated/parsers/filter/FilterParser.js';
import FilterLexer from '../generated/parsers/filter/FilterLexer.js';
import FilterVisitor from './FilterVisitor.js';


// const input = 'ccy = SEK'
// const input = 'ccy = GBP and price = 100 and lotsize = 10 or exchange = LON';
const input = '(ccy = GBP or ccy = SEK) and price = 100';


class ExprErrorListener extends antlr4.error.ErrorListener {
  constructor(errors){
    super();
    this.errors = errors;
  }

  syntaxError(recognizer, offendingSymbol, line, column, msg, err) {
    console.log(`%cerror ${msg}`,'color: red;font-weight: bold;')
    this.errors.push(err)
  }
}
export const parseFilter = (input) => {
  const errors = [];
  var chars = new antlr4.InputStream(input);
  var lexer = new FilterLexer(chars);
  var tokens = new antlr4.CommonTokenStream(lexer)
  var parser = new FilterParser(tokens);

  const errorListener = new ExprErrorListener(errors)

  parser.removeErrorListeners();
  parser.addErrorListener(errorListener);

  parser.buildParseTrees = true;

  const tree = parser.expression();

  // const listener = new FilterListener();
  // antlr4.tree.ParseTreeWalker.DEFAULT.walk(listener,tree);

  const visitor = new FilterVisitor();
  const result = visitor.visit(tree);

  parser.inputStream = parser._input;
  parser.atn.states.forEach((state) => {
		state.getTransitions = () => state.transitions;
	});


  const core = new c3.CodeCompletionCore(parser);
  let candidates = core.collectCandidates(0);


  return [result, errors, candidates];
}
