import FilterVisitor from '../generated/parsers/filter/FilterVisitor.js';

// This class defines a complete generic visitor for a parse tree produced by FilterParser.

const withLiterals = ctx => (res, i) => res ?? ctx.children[i].toString();
export default class CustomFilterVisitor extends FilterVisitor {

	// Visit a parse tree produced by FilterParser#expression.
	visitExpression(ctx) {
	  const expression = this.visitChildren(ctx)?.map(withLiterals(ctx));
		console.log({expression});
		return expression;
	}


	// Visit a parse tree produced by FilterParser#or_expression.
	visitOr_expression(ctx) {
	  const orExpression = this.visitChildren(ctx)?.map(withLiterals(ctx));
		console.log({orExpression})
		return orExpression;
	}


	// Visit a parse tree produced by FilterParser#and_expression.
	visitAnd_expression(ctx) {
	  const andExpression = this.visitChildren(ctx)?.map(withLiterals(ctx));
		console.log({andExpression});
		return andExpression;
	}


	// Visit a parse tree produced by FilterParser#term.
	visitTerm(ctx) {
		const terms = this.visitChildren(ctx)?.map(withLiterals(ctx));
		console.log({terms})
	  return terms;
	}


	// Visit a parse tree produced by FilterParser#atom.
	visitAtom(ctx) {
		const [atom] = ctx.children;
		console.log(`visitAtom ${atom.toString()}`)
	  return atom.toString();
	}


	// Visit a parse tree produced by FilterParser#operator.
	visitOperator(ctx) {
		const [op] = ctx.children;
		console.log(`visitOperator ${op.toString()}`)
	  return op.toString();
	}



}
