// Generated from ./src/grammars/Filter.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";

import { ExpressionContext } from "./FilterParser";
import { Or_expressionContext } from "./FilterParser";
import { And_expressionContext } from "./FilterParser";
import { TermContext } from "./FilterParser";
import { Col_set_expressionContext } from "./FilterParser";
import { Col_val_expressionContext } from "./FilterParser";
import { AtomContext } from "./FilterParser";
import { ColumnContext } from "./FilterParser";
import { OperatorContext } from "./FilterParser";


/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by `FilterParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export interface FilterVisitor<Result> extends ParseTreeVisitor<Result> {
	/**
	 * Visit a parse tree produced by `FilterParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExpression?: (ctx: ExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `FilterParser.or_expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitOr_expression?: (ctx: Or_expressionContext) => Result;

	/**
	 * Visit a parse tree produced by `FilterParser.and_expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAnd_expression?: (ctx: And_expressionContext) => Result;

	/**
	 * Visit a parse tree produced by `FilterParser.term`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTerm?: (ctx: TermContext) => Result;

	/**
	 * Visit a parse tree produced by `FilterParser.col_set_expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCol_set_expression?: (ctx: Col_set_expressionContext) => Result;

	/**
	 * Visit a parse tree produced by `FilterParser.col_val_expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCol_val_expression?: (ctx: Col_val_expressionContext) => Result;

	/**
	 * Visit a parse tree produced by `FilterParser.atom`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAtom?: (ctx: AtomContext) => Result;

	/**
	 * Visit a parse tree produced by `FilterParser.column`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitColumn?: (ctx: ColumnContext) => Result;

	/**
	 * Visit a parse tree produced by `FilterParser.operator`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitOperator?: (ctx: OperatorContext) => Result;
}

