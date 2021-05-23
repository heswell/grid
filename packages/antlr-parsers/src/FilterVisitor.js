import {Token} from 'antlr4ts/Token';
import { AbstractParseTreeVisitor } from 'antlr4ts/tree/AbstractParseTreeVisitor'
import { transitionNext } from '../../datagrid-nav/src/state-machinery/machines/machine-utils';
// import {FilterVisitor} from '../generated/parsers/filter/FilterVisitor.ts';

// This class defines a complete generic visitor for a parse tree produced by FilterParser.

const EMPTY = [];
export default class CustomFilterVisitor extends AbstractParseTreeVisitor {

  defaultResult(){
    return [];
  }

  aggregateResult(aggregate, nextResult){
    return aggregate.concat(nextResult)
  }

	// Visit a parse tree produced by FilterParser#expression.
	visitExpression(ctx) {
    const result = this.visitChildren(ctx);

	  // const expression = this.visitChildren(ctx)?.map(withLiterals(ctx));
		console.log({expression: result});
		return result;
	}


	// Visit a parse tree produced by FilterParser#or_expression.
	visitOr_expression(ctx) {
    const result = this.visitChildren(ctx);
	  // const orExpression = this.visitChildren(ctx)?.map(withLiterals(ctx));
		console.log({orExpression: result})
		return result;
	}


	// Visit a parse tree produced by FilterParser#and_expression.
	visitAnd_expression(ctx) {
    const result = this.visitChildren(ctx);
	  // const andExpression = this.visitChildren(ctx)?.map(withLiterals(ctx));
		console.log({andExpression: result});
		return result;
	}


	// Visit a parse tree produced by FilterParser#term.
	visitTerm(ctx) {
    const result = this.visitChildren(ctx);
		console.log({term: result});
    // const term = ctx.text;
		// const terms = this.visitChildren(ctx)?.map(withLiterals(ctx));
		// console.log({terms})
	  // return terms;
    return result;
	}


	// Visit a parse tree produced by FilterParser#column.
	visitColumn(ctx) {
    const column = ctx.text;
		console.log({column});
	  return column;
	}

  // Visit a parse tree produced by FilterParser#atom.
	visitAtom(ctx) {
    const atom = ctx.text;
		console.log({atom});
	  return atom;
	}


	// Visit a parse tree produced by FilterParser#operator.
	visitOperator(ctx) {
		console.log(`visitOperator ${ctx.text}`)
	  return ctx.text;
	}

  visitTerminal(ctx){
    if (ctx.symbol.type === Token.EOF){
      return EMPTY;
    } else {
      const terminal = ctx.text;
      console.log(`visit terminal ${terminal}`)
      return terminal;

    }
  }



}
