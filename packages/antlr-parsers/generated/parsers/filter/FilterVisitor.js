// Generated from ./src/grammars/Filter.g4 by ANTLR 4.9.2
// jshint ignore: start
import antlr4 from 'antlr4';

// This class defines a complete generic visitor for a parse tree produced by FilterParser.

export default class FilterVisitor extends antlr4.tree.ParseTreeVisitor {

	// Visit a parse tree produced by FilterParser#expression.
	visitExpression(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by FilterParser#or_expression.
	visitOr_expression(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by FilterParser#and_expression.
	visitAnd_expression(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by FilterParser#term.
	visitTerm(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by FilterParser#atom.
	visitAtom(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by FilterParser#operator.
	visitOperator(ctx) {
	  return this.visitChildren(ctx);
	}



}