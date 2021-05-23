// Generated from ./src/grammars/Filter.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";

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
 * This interface defines a complete listener for a parse tree produced by
 * `FilterParser`.
 */
export interface FilterListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by `FilterParser.expression`.
	 * @param ctx the parse tree
	 */
	enterExpression?: (ctx: ExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `FilterParser.expression`.
	 * @param ctx the parse tree
	 */
	exitExpression?: (ctx: ExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `FilterParser.or_expression`.
	 * @param ctx the parse tree
	 */
	enterOr_expression?: (ctx: Or_expressionContext) => void;
	/**
	 * Exit a parse tree produced by `FilterParser.or_expression`.
	 * @param ctx the parse tree
	 */
	exitOr_expression?: (ctx: Or_expressionContext) => void;

	/**
	 * Enter a parse tree produced by `FilterParser.and_expression`.
	 * @param ctx the parse tree
	 */
	enterAnd_expression?: (ctx: And_expressionContext) => void;
	/**
	 * Exit a parse tree produced by `FilterParser.and_expression`.
	 * @param ctx the parse tree
	 */
	exitAnd_expression?: (ctx: And_expressionContext) => void;

	/**
	 * Enter a parse tree produced by `FilterParser.term`.
	 * @param ctx the parse tree
	 */
	enterTerm?: (ctx: TermContext) => void;
	/**
	 * Exit a parse tree produced by `FilterParser.term`.
	 * @param ctx the parse tree
	 */
	exitTerm?: (ctx: TermContext) => void;

	/**
	 * Enter a parse tree produced by `FilterParser.col_set_expression`.
	 * @param ctx the parse tree
	 */
	enterCol_set_expression?: (ctx: Col_set_expressionContext) => void;
	/**
	 * Exit a parse tree produced by `FilterParser.col_set_expression`.
	 * @param ctx the parse tree
	 */
	exitCol_set_expression?: (ctx: Col_set_expressionContext) => void;

	/**
	 * Enter a parse tree produced by `FilterParser.col_val_expression`.
	 * @param ctx the parse tree
	 */
	enterCol_val_expression?: (ctx: Col_val_expressionContext) => void;
	/**
	 * Exit a parse tree produced by `FilterParser.col_val_expression`.
	 * @param ctx the parse tree
	 */
	exitCol_val_expression?: (ctx: Col_val_expressionContext) => void;

	/**
	 * Enter a parse tree produced by `FilterParser.atom`.
	 * @param ctx the parse tree
	 */
	enterAtom?: (ctx: AtomContext) => void;
	/**
	 * Exit a parse tree produced by `FilterParser.atom`.
	 * @param ctx the parse tree
	 */
	exitAtom?: (ctx: AtomContext) => void;

	/**
	 * Enter a parse tree produced by `FilterParser.column`.
	 * @param ctx the parse tree
	 */
	enterColumn?: (ctx: ColumnContext) => void;
	/**
	 * Exit a parse tree produced by `FilterParser.column`.
	 * @param ctx the parse tree
	 */
	exitColumn?: (ctx: ColumnContext) => void;

	/**
	 * Enter a parse tree produced by `FilterParser.operator`.
	 * @param ctx the parse tree
	 */
	enterOperator?: (ctx: OperatorContext) => void;
	/**
	 * Exit a parse tree produced by `FilterParser.operator`.
	 * @param ctx the parse tree
	 */
	exitOperator?: (ctx: OperatorContext) => void;
}

