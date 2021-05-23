import { CharStreams, CommonTokenStream } from 'antlr4ts'
import * as c3 from 'antlr4-c3';
import { FilterParser } from '../generated/parsers/filter/FilterParser.ts';
import { FilterLexer } from '../generated/parsers/filter/FilterLexer.ts';
import FilterVisitor from './FilterVisitor.js';
import { computeTokenIndex } from './parse-utils';

const suggestColumnNames = (text) => {
  const columnNames = ['ccy', 'price', 'quantity', 'timestamp'];
  if (text) {
    return columnNames.filter(col => col.startsWith(text))
  } else {
    return columnNames;
  }
}

const maybeSuggest = (completion, text, suggestions) => {
  if (tokenMatches(completion, text)) {
    suggestions.push(completion);
  }
}

function tokenMatches(completion, text) {
  return text.trim().length == 0 || (
    completion.toLowerCase().startsWith(text.toLowerCase())
    && completion.toLowerCase() !== text.toLowerCase()
  )
}

const textValue = text => text.startsWith("'") ? text.slice(1, -1).toLowerCase() : text;


// const input = 'ccy = SEK'
// const input = 'ccy = GBP and price = 100 and lotsize = 10 or exchange = LON';
// const input = '(ccy = GBP or ccy = SEK) and price = 100';


class ExprErrorListener {
  constructor(errors) {
    this.errors = errors;
  }

  syntaxError(recognizer, offendingSymbol, line, column, msg, err) {
    console.log(`%cerror ${msg}`, 'color: red;font-weight: bold;')
    this.errors.push(err)
  }
}
export const parseFilter = (input) => {
  const errors = [];
  let inputStream = CharStreams.fromString(input);
  let lexer = new FilterLexer(inputStream);
  let tokenStream = new CommonTokenStream(lexer)
  var parser = new FilterParser(tokenStream);

  const errorListener = new ExprErrorListener(errors)

  parser.removeErrorListeners();
  parser.addErrorListener(errorListener);

  parser.buildParseTrees = true;

  const parseTree = parser.expression();

  const visitor = new FilterVisitor();
  const result = visitor.visit(parseTree);

  parser.inputStream = parser._input;
  parser.atn.states.forEach((state) => {
    state.getTransitions = () => state.transitions;
  });


  const core = new c3.CodeCompletionCore(parser);
  const caretPosition = { line: 1, column: input.length };
  core.preferredRules = new Set([FilterParser.RULE_column]);
  core.ignoredTokens = new Set([FilterParser.LPAREN]);
  let tokenPosition = computeTokenIndex(parseTree, caretPosition);
  console.log({ tokenPosition })
  let candidates = core.collectCandidates(tokenPosition.index);

  let suggestions = [];

  if (candidates.rules.has(FilterParser.RULE_column)) {
    suggestions.push(...suggestColumnNames(tokenPosition.text))
  }

  candidates.tokens.forEach((_, key) => {
    let candidate;
    if (key === FilterParser.RULE_column) {
      // ignore
    } else {
      candidate = textValue(parser.vocabulary.getDisplayName(key));
    }

    if (candidate) {
      maybeSuggest(candidate, tokenPosition.text, suggestions)
    }
  })

  // for (let candidate of candidates.rules){
  //   switch(candidate[0]){
  //     case FilterParser.RULE_column:
  //       console.log(`got a Column`);
  //       break;
  //     default:
  //       console.log(`got some other rule`);

  //   }
  // }

  return [result, errors, suggestions];
}
