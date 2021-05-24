// Generated from ./src/grammars/Filter.g4 by ANTLR 4.9.0-SNAPSHOT


import { ATN } from "antlr4ts/atn/ATN";
import { ATNDeserializer } from "antlr4ts/atn/ATNDeserializer";
import { FailedPredicateException } from "antlr4ts/FailedPredicateException";
import { NotNull } from "antlr4ts/Decorators";
import { NoViableAltException } from "antlr4ts/NoViableAltException";
import { Override } from "antlr4ts/Decorators";
import { Parser } from "antlr4ts/Parser";
import { ParserRuleContext } from "antlr4ts/ParserRuleContext";
import { ParserATNSimulator } from "antlr4ts/atn/ParserATNSimulator";
import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";
import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";
import { RecognitionException } from "antlr4ts/RecognitionException";
import { RuleContext } from "antlr4ts/RuleContext";
//import { RuleVersion } from "antlr4ts/RuleVersion";
import { TerminalNode } from "antlr4ts/tree/TerminalNode";
import { Token } from "antlr4ts/Token";
import { TokenStream } from "antlr4ts/TokenStream";
import { Vocabulary } from "antlr4ts/Vocabulary";
import { VocabularyImpl } from "antlr4ts/VocabularyImpl";

import * as Utils from "antlr4ts/misc/Utils";

import { FilterListener } from "./FilterListener";
import { FilterVisitor } from "./FilterVisitor";


export class FilterParser extends Parser {
	public static readonly TRUE = 1;
	public static readonly FALSE = 2;
	public static readonly AND = 3;
	public static readonly OR = 4;
	public static readonly LT = 5;
	public static readonly GT = 6;
	public static readonly EQ = 7;
	public static readonly NEQ = 8;
	public static readonly IN = 9;
	public static readonly STARTS = 10;
	public static readonly ENDS = 11;
	public static readonly PATHSEP = 12;
	public static readonly LBRACK = 13;
	public static readonly RBRACK = 14;
	public static readonly LPAREN = 15;
	public static readonly RPAREN = 16;
	public static readonly COMMA = 17;
	public static readonly INT = 18;
	public static readonly FLOAT = 19;
	public static readonly STRING = 20;
	public static readonly ID = 21;
	public static readonly WS = 22;
	public static readonly RULE_expression = 0;
	public static readonly RULE_or_expression = 1;
	public static readonly RULE_and_expression = 2;
	public static readonly RULE_term = 3;
	public static readonly RULE_col_set_expression = 4;
	public static readonly RULE_col_val_expression = 5;
	public static readonly RULE_atoms = 6;
	public static readonly RULE_atom = 7;
	public static readonly RULE_column = 8;
	public static readonly RULE_operator = 9;
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"expression", "or_expression", "and_expression", "term", "col_set_expression", 
		"col_val_expression", "atoms", "atom", "column", "operator",
	];

	private static readonly _LITERAL_NAMES: Array<string | undefined> = [
		undefined, "'true'", "'false'", "'and'", "'or'", "'<'", "'>'", "'='", 
		"'!='", "'in'", "'starts'", "'ends'", "'/'", "'['", "']'", "'('", "')'", 
		"','",
	];
	private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
		undefined, "TRUE", "FALSE", "AND", "OR", "LT", "GT", "EQ", "NEQ", "IN", 
		"STARTS", "ENDS", "PATHSEP", "LBRACK", "RBRACK", "LPAREN", "RPAREN", "COMMA", 
		"INT", "FLOAT", "STRING", "ID", "WS",
	];
	public static readonly VOCABULARY: Vocabulary = new VocabularyImpl(FilterParser._LITERAL_NAMES, FilterParser._SYMBOLIC_NAMES, []);

	// @Override
	// @NotNull
	public get vocabulary(): Vocabulary {
		return FilterParser.VOCABULARY;
	}
	// tslint:enable:no-trailing-whitespace

	// @Override
	public get grammarFileName(): string { return "Filter.g4"; }

	// @Override
	public get ruleNames(): string[] { return FilterParser.ruleNames; }

	// @Override
	public get serializedATN(): string { return FilterParser._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(FilterParser._ATN, this);
	}
	// @RuleVersion(0)
	public expression(): ExpressionContext {
		let _localctx: ExpressionContext = new ExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 0, FilterParser.RULE_expression);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 20;
			this.or_expression();
			this.state = 21;
			this.match(FilterParser.EOF);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public or_expression(): Or_expressionContext {
		let _localctx: Or_expressionContext = new Or_expressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 2, FilterParser.RULE_or_expression);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 23;
			this.and_expression();
			this.state = 28;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 0, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 24;
					this.match(FilterParser.OR);
					this.state = 25;
					this.or_expression();
					}
					}
				}
				this.state = 30;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 0, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public and_expression(): And_expressionContext {
		let _localctx: And_expressionContext = new And_expressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 4, FilterParser.RULE_and_expression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 31;
			this.term();
			this.state = 36;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === FilterParser.AND) {
				{
				{
				this.state = 32;
				this.match(FilterParser.AND);
				this.state = 33;
				this.term();
				}
				}
				this.state = 38;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public term(): TermContext {
		let _localctx: TermContext = new TermContext(this._ctx, this.state);
		this.enterRule(_localctx, 6, FilterParser.RULE_term);
		try {
			this.state = 45;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 2, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 39;
				this.col_val_expression();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 40;
				this.col_set_expression();
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 41;
				this.match(FilterParser.LPAREN);
				this.state = 42;
				this.or_expression();
				this.state = 43;
				this.match(FilterParser.RPAREN);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public col_set_expression(): Col_set_expressionContext {
		let _localctx: Col_set_expressionContext = new Col_set_expressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 8, FilterParser.RULE_col_set_expression);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 47;
			this.column();
			this.state = 48;
			this.match(FilterParser.IN);
			this.state = 49;
			this.match(FilterParser.LBRACK);
			this.state = 50;
			this.atoms();
			this.state = 51;
			this.match(FilterParser.RBRACK);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public col_val_expression(): Col_val_expressionContext {
		let _localctx: Col_val_expressionContext = new Col_val_expressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 10, FilterParser.RULE_col_val_expression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 53;
			this.column();
			this.state = 57;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << FilterParser.LT) | (1 << FilterParser.GT) | (1 << FilterParser.EQ) | (1 << FilterParser.NEQ) | (1 << FilterParser.STARTS) | (1 << FilterParser.ENDS))) !== 0)) {
				{
				this.state = 54;
				this.operator();
				this.state = 55;
				this.atom();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public atoms(): AtomsContext {
		let _localctx: AtomsContext = new AtomsContext(this._ctx, this.state);
		this.enterRule(_localctx, 12, FilterParser.RULE_atoms);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 59;
			this.atom();
			this.state = 64;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === FilterParser.COMMA) {
				{
				{
				this.state = 60;
				this.match(FilterParser.COMMA);
				this.state = 61;
				this.atom();
				}
				}
				this.state = 66;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public atom(): AtomContext {
		let _localctx: AtomContext = new AtomContext(this._ctx, this.state);
		this.enterRule(_localctx, 14, FilterParser.RULE_atom);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 67;
			_la = this._input.LA(1);
			if (!((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << FilterParser.TRUE) | (1 << FilterParser.FALSE) | (1 << FilterParser.INT) | (1 << FilterParser.FLOAT) | (1 << FilterParser.STRING) | (1 << FilterParser.ID))) !== 0))) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public column(): ColumnContext {
		let _localctx: ColumnContext = new ColumnContext(this._ctx, this.state);
		this.enterRule(_localctx, 16, FilterParser.RULE_column);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 69;
			this.match(FilterParser.ID);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public operator(): OperatorContext {
		let _localctx: OperatorContext = new OperatorContext(this._ctx, this.state);
		this.enterRule(_localctx, 18, FilterParser.RULE_operator);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 71;
			_la = this._input.LA(1);
			if (!((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << FilterParser.LT) | (1 << FilterParser.GT) | (1 << FilterParser.EQ) | (1 << FilterParser.NEQ) | (1 << FilterParser.STARTS) | (1 << FilterParser.ENDS))) !== 0))) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public static readonly _serializedATN: string =
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x03\x18L\x04\x02" +
		"\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04\x07" +
		"\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x03\x02\x03\x02\x03\x02" +
		"\x03\x03\x03\x03\x03\x03\x07\x03\x1D\n\x03\f\x03\x0E\x03 \v\x03\x03\x04" +
		"\x03\x04\x03\x04\x07\x04%\n\x04\f\x04\x0E\x04(\v\x04\x03\x05\x03\x05\x03" +
		"\x05\x03\x05\x03\x05\x03\x05\x05\x050\n\x05\x03\x06\x03\x06\x03\x06\x03" +
		"\x06\x03\x06\x03\x06\x03\x07\x03\x07\x03\x07\x03\x07\x05\x07<\n\x07\x03" +
		"\b\x03\b\x03\b\x07\bA\n\b\f\b\x0E\bD\v\b\x03\t\x03\t\x03\n\x03\n\x03\v" +
		"\x03\v\x03\v\x02\x02\x02\f\x02\x02\x04\x02\x06\x02\b\x02\n\x02\f\x02\x0E" +
		"\x02\x10\x02\x12\x02\x14\x02\x02\x04\x04\x02\x03\x04\x14\x17\x04\x02\x07" +
		"\n\f\r\x02G\x02\x16\x03\x02\x02\x02\x04\x19\x03\x02\x02\x02\x06!\x03\x02" +
		"\x02\x02\b/\x03\x02\x02\x02\n1\x03\x02\x02\x02\f7\x03\x02\x02\x02\x0E" +
		"=\x03\x02\x02\x02\x10E\x03\x02\x02\x02\x12G\x03\x02\x02\x02\x14I\x03\x02" +
		"\x02\x02\x16\x17\x05\x04\x03\x02\x17\x18\x07\x02\x02\x03\x18\x03\x03\x02" +
		"\x02\x02\x19\x1E\x05\x06\x04\x02\x1A\x1B\x07\x06\x02\x02\x1B\x1D\x05\x04" +
		"\x03\x02\x1C\x1A\x03\x02\x02\x02\x1D \x03\x02\x02\x02\x1E\x1C\x03\x02" +
		"\x02\x02\x1E\x1F\x03\x02\x02\x02\x1F\x05\x03\x02\x02\x02 \x1E\x03\x02" +
		"\x02\x02!&\x05\b\x05\x02\"#\x07\x05\x02\x02#%\x05\b\x05\x02$\"\x03\x02" +
		"\x02\x02%(\x03\x02\x02\x02&$\x03\x02\x02\x02&\'\x03\x02\x02\x02\'\x07" +
		"\x03\x02\x02\x02(&\x03\x02\x02\x02)0\x05\f\x07\x02*0\x05\n\x06\x02+,\x07" +
		"\x11\x02\x02,-\x05\x04\x03\x02-.\x07\x12\x02\x02.0\x03\x02\x02\x02/)\x03" +
		"\x02\x02\x02/*\x03\x02\x02\x02/+\x03\x02\x02\x020\t\x03\x02\x02\x0212" +
		"\x05\x12\n\x0223\x07\v\x02\x0234\x07\x0F\x02\x0245\x05\x0E\b\x0256\x07" +
		"\x10\x02\x026\v\x03\x02\x02\x027;\x05\x12\n\x0289\x05\x14\v\x029:\x05" +
		"\x10\t\x02:<\x03\x02\x02\x02;8\x03\x02\x02\x02;<\x03\x02\x02\x02<\r\x03" +
		"\x02\x02\x02=B\x05\x10\t\x02>?\x07\x13\x02\x02?A\x05\x10\t\x02@>\x03\x02" +
		"\x02\x02AD\x03\x02\x02\x02B@\x03\x02\x02\x02BC\x03\x02\x02\x02C\x0F\x03" +
		"\x02\x02\x02DB\x03\x02\x02\x02EF\t\x02\x02\x02F\x11\x03\x02\x02\x02GH" +
		"\x07\x17\x02\x02H\x13\x03\x02\x02\x02IJ\t\x03\x02\x02J\x15\x03\x02\x02" +
		"\x02\x07\x1E&/;B";
	public static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!FilterParser.__ATN) {
			FilterParser.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(FilterParser._serializedATN));
		}

		return FilterParser.__ATN;
	}

}

export class ExpressionContext extends ParserRuleContext {
	public or_expression(): Or_expressionContext {
		return this.getRuleContext(0, Or_expressionContext);
	}
	public EOF(): TerminalNode { return this.getToken(FilterParser.EOF, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return FilterParser.RULE_expression; }
	// @Override
	public enterRule(listener: FilterListener): void {
		if (listener.enterExpression) {
			listener.enterExpression(this);
		}
	}
	// @Override
	public exitRule(listener: FilterListener): void {
		if (listener.exitExpression) {
			listener.exitExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: FilterVisitor<Result>): Result {
		if (visitor.visitExpression) {
			return visitor.visitExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Or_expressionContext extends ParserRuleContext {
	public and_expression(): And_expressionContext {
		return this.getRuleContext(0, And_expressionContext);
	}
	public OR(): TerminalNode[];
	public OR(i: number): TerminalNode;
	public OR(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(FilterParser.OR);
		} else {
			return this.getToken(FilterParser.OR, i);
		}
	}
	public or_expression(): Or_expressionContext[];
	public or_expression(i: number): Or_expressionContext;
	public or_expression(i?: number): Or_expressionContext | Or_expressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(Or_expressionContext);
		} else {
			return this.getRuleContext(i, Or_expressionContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return FilterParser.RULE_or_expression; }
	// @Override
	public enterRule(listener: FilterListener): void {
		if (listener.enterOr_expression) {
			listener.enterOr_expression(this);
		}
	}
	// @Override
	public exitRule(listener: FilterListener): void {
		if (listener.exitOr_expression) {
			listener.exitOr_expression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: FilterVisitor<Result>): Result {
		if (visitor.visitOr_expression) {
			return visitor.visitOr_expression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class And_expressionContext extends ParserRuleContext {
	public term(): TermContext[];
	public term(i: number): TermContext;
	public term(i?: number): TermContext | TermContext[] {
		if (i === undefined) {
			return this.getRuleContexts(TermContext);
		} else {
			return this.getRuleContext(i, TermContext);
		}
	}
	public AND(): TerminalNode[];
	public AND(i: number): TerminalNode;
	public AND(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(FilterParser.AND);
		} else {
			return this.getToken(FilterParser.AND, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return FilterParser.RULE_and_expression; }
	// @Override
	public enterRule(listener: FilterListener): void {
		if (listener.enterAnd_expression) {
			listener.enterAnd_expression(this);
		}
	}
	// @Override
	public exitRule(listener: FilterListener): void {
		if (listener.exitAnd_expression) {
			listener.exitAnd_expression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: FilterVisitor<Result>): Result {
		if (visitor.visitAnd_expression) {
			return visitor.visitAnd_expression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TermContext extends ParserRuleContext {
	public col_val_expression(): Col_val_expressionContext | undefined {
		return this.tryGetRuleContext(0, Col_val_expressionContext);
	}
	public col_set_expression(): Col_set_expressionContext | undefined {
		return this.tryGetRuleContext(0, Col_set_expressionContext);
	}
	public LPAREN(): TerminalNode | undefined { return this.tryGetToken(FilterParser.LPAREN, 0); }
	public or_expression(): Or_expressionContext | undefined {
		return this.tryGetRuleContext(0, Or_expressionContext);
	}
	public RPAREN(): TerminalNode | undefined { return this.tryGetToken(FilterParser.RPAREN, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return FilterParser.RULE_term; }
	// @Override
	public enterRule(listener: FilterListener): void {
		if (listener.enterTerm) {
			listener.enterTerm(this);
		}
	}
	// @Override
	public exitRule(listener: FilterListener): void {
		if (listener.exitTerm) {
			listener.exitTerm(this);
		}
	}
	// @Override
	public accept<Result>(visitor: FilterVisitor<Result>): Result {
		if (visitor.visitTerm) {
			return visitor.visitTerm(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Col_set_expressionContext extends ParserRuleContext {
	public column(): ColumnContext {
		return this.getRuleContext(0, ColumnContext);
	}
	public IN(): TerminalNode { return this.getToken(FilterParser.IN, 0); }
	public LBRACK(): TerminalNode { return this.getToken(FilterParser.LBRACK, 0); }
	public atoms(): AtomsContext {
		return this.getRuleContext(0, AtomsContext);
	}
	public RBRACK(): TerminalNode { return this.getToken(FilterParser.RBRACK, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return FilterParser.RULE_col_set_expression; }
	// @Override
	public enterRule(listener: FilterListener): void {
		if (listener.enterCol_set_expression) {
			listener.enterCol_set_expression(this);
		}
	}
	// @Override
	public exitRule(listener: FilterListener): void {
		if (listener.exitCol_set_expression) {
			listener.exitCol_set_expression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: FilterVisitor<Result>): Result {
		if (visitor.visitCol_set_expression) {
			return visitor.visitCol_set_expression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Col_val_expressionContext extends ParserRuleContext {
	public column(): ColumnContext {
		return this.getRuleContext(0, ColumnContext);
	}
	public operator(): OperatorContext | undefined {
		return this.tryGetRuleContext(0, OperatorContext);
	}
	public atom(): AtomContext | undefined {
		return this.tryGetRuleContext(0, AtomContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return FilterParser.RULE_col_val_expression; }
	// @Override
	public enterRule(listener: FilterListener): void {
		if (listener.enterCol_val_expression) {
			listener.enterCol_val_expression(this);
		}
	}
	// @Override
	public exitRule(listener: FilterListener): void {
		if (listener.exitCol_val_expression) {
			listener.exitCol_val_expression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: FilterVisitor<Result>): Result {
		if (visitor.visitCol_val_expression) {
			return visitor.visitCol_val_expression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AtomsContext extends ParserRuleContext {
	public atom(): AtomContext[];
	public atom(i: number): AtomContext;
	public atom(i?: number): AtomContext | AtomContext[] {
		if (i === undefined) {
			return this.getRuleContexts(AtomContext);
		} else {
			return this.getRuleContext(i, AtomContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(FilterParser.COMMA);
		} else {
			return this.getToken(FilterParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return FilterParser.RULE_atoms; }
	// @Override
	public enterRule(listener: FilterListener): void {
		if (listener.enterAtoms) {
			listener.enterAtoms(this);
		}
	}
	// @Override
	public exitRule(listener: FilterListener): void {
		if (listener.exitAtoms) {
			listener.exitAtoms(this);
		}
	}
	// @Override
	public accept<Result>(visitor: FilterVisitor<Result>): Result {
		if (visitor.visitAtoms) {
			return visitor.visitAtoms(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AtomContext extends ParserRuleContext {
	public ID(): TerminalNode | undefined { return this.tryGetToken(FilterParser.ID, 0); }
	public INT(): TerminalNode | undefined { return this.tryGetToken(FilterParser.INT, 0); }
	public FLOAT(): TerminalNode | undefined { return this.tryGetToken(FilterParser.FLOAT, 0); }
	public STRING(): TerminalNode | undefined { return this.tryGetToken(FilterParser.STRING, 0); }
	public TRUE(): TerminalNode | undefined { return this.tryGetToken(FilterParser.TRUE, 0); }
	public FALSE(): TerminalNode | undefined { return this.tryGetToken(FilterParser.FALSE, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return FilterParser.RULE_atom; }
	// @Override
	public enterRule(listener: FilterListener): void {
		if (listener.enterAtom) {
			listener.enterAtom(this);
		}
	}
	// @Override
	public exitRule(listener: FilterListener): void {
		if (listener.exitAtom) {
			listener.exitAtom(this);
		}
	}
	// @Override
	public accept<Result>(visitor: FilterVisitor<Result>): Result {
		if (visitor.visitAtom) {
			return visitor.visitAtom(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ColumnContext extends ParserRuleContext {
	public ID(): TerminalNode { return this.getToken(FilterParser.ID, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return FilterParser.RULE_column; }
	// @Override
	public enterRule(listener: FilterListener): void {
		if (listener.enterColumn) {
			listener.enterColumn(this);
		}
	}
	// @Override
	public exitRule(listener: FilterListener): void {
		if (listener.exitColumn) {
			listener.exitColumn(this);
		}
	}
	// @Override
	public accept<Result>(visitor: FilterVisitor<Result>): Result {
		if (visitor.visitColumn) {
			return visitor.visitColumn(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class OperatorContext extends ParserRuleContext {
	public LT(): TerminalNode | undefined { return this.tryGetToken(FilterParser.LT, 0); }
	public GT(): TerminalNode | undefined { return this.tryGetToken(FilterParser.GT, 0); }
	public EQ(): TerminalNode | undefined { return this.tryGetToken(FilterParser.EQ, 0); }
	public NEQ(): TerminalNode | undefined { return this.tryGetToken(FilterParser.NEQ, 0); }
	public STARTS(): TerminalNode | undefined { return this.tryGetToken(FilterParser.STARTS, 0); }
	public ENDS(): TerminalNode | undefined { return this.tryGetToken(FilterParser.ENDS, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return FilterParser.RULE_operator; }
	// @Override
	public enterRule(listener: FilterListener): void {
		if (listener.enterOperator) {
			listener.enterOperator(this);
		}
	}
	// @Override
	public exitRule(listener: FilterListener): void {
		if (listener.exitOperator) {
			listener.exitOperator(this);
		}
	}
	// @Override
	public accept<Result>(visitor: FilterVisitor<Result>): Result {
		if (visitor.visitOperator) {
			return visitor.visitOperator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


