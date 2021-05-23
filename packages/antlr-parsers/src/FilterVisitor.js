import {Token} from 'antlr4ts/Token';
import { AbstractParseTreeVisitor } from 'antlr4ts/tree/AbstractParseTreeVisitor'

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
		return result;
	}


	// Visit a parse tree produced by FilterParser#or_expression.
	visitOr_expression(ctx) {
    const [term1, type, term2 ] = this.visitChildren(ctx);
    if (term2){
      return { type, filters: [term1, term2] };
    } else {
      return term1
    }
	}


	// Visit a parse tree produced by FilterParser#and_expression.
	visitAnd_expression(ctx) {
    const [term1, type, term2 ] = this.visitChildren(ctx);
    if (term2){
      return { type, filters: [term1, term2] };
    } else {
      return term1
    }
	}


	// Visit a parse tree produced by FilterParser#term.
	visitTerm(ctx) {
    return this.visitChildren(ctx);
	}

	/**
	 * Visit a parse tree produced by `FilterParser.col_set_expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
   visitCol_set_expression(ctx){
    const [column, type, value] = this.visitChildren(ctx);
    return { column, type, value };
   };

   /**
    * Visit a parse tree produced by `FilterParser.col_val_expression`.
    * @param ctx the parse tree
    * @return the visitor result
    */
   visitCol_val_expression(ctx){
    const [column, type, value] = this.visitChildren(ctx);
    return { column, type, value };
  }

	// Visit a parse tree produced by FilterParser#column.
	visitColumn(ctx) {
	  return ctx.text;
	}

  // Visit a parse tree produced by FilterParser#atom.
	visitAtoms(ctx) {
	  return this.visitChildren(ctx);
	}

  visitAtom(ctx) {
	  return ctx.text;
	}

	// Visit a parse tree produced by FilterParser#operator.
	visitOperator(ctx) {
	  return ctx.text;
	}

  visitTerminal(ctx){
    if (ctx.symbol.type === Token.EOF){
      return EMPTY;
    } else {
	    return ctx.text;
    }
  }



}
