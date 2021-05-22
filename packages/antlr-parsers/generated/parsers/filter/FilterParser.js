// Generated from ./src/grammars/Filter.g4 by ANTLR 4.9.2
// jshint ignore: start
import antlr4 from 'antlr4';
import FilterListener from './FilterListener.js';
import FilterVisitor from './FilterVisitor.js';


const serializedATN = ["\u0003\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786",
    "\u5964\u0003\u0018=\u0004\u0002\t\u0002\u0004\u0003\t\u0003\u0004\u0004",
    "\t\u0004\u0004\u0005\t\u0005\u0004\u0006\t\u0006\u0004\u0007\t\u0007",
    "\u0003\u0002\u0003\u0002\u0003\u0002\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0007\u0003\u0015\n\u0003\f\u0003\u000e\u0003\u0018\u000b\u0003\u0003",
    "\u0004\u0003\u0004\u0003\u0004\u0007\u0004\u001d\n\u0004\f\u0004\u000e",
    "\u0004 \u000b\u0004\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005",
    "\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005",
    "\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0007\u00050\n\u0005",
    "\f\u0005\u000e\u00053\u000b\u0005\u0003\u0005\u0003\u0005\u0005\u0005",
    "7\n\u0005\u0003\u0006\u0003\u0006\u0003\u0007\u0003\u0007\u0003\u0007",
    "\u0002\u0002\b\u0002\u0004\u0006\b\n\f\u0002\u0004\u0004\u0002\u0004",
    "\u0005\u0014\u0017\u0003\u0002\b\u000e\u0002;\u0002\u000e\u0003\u0002",
    "\u0002\u0002\u0004\u0011\u0003\u0002\u0002\u0002\u0006\u0019\u0003\u0002",
    "\u0002\u0002\b6\u0003\u0002\u0002\u0002\n8\u0003\u0002\u0002\u0002\f",
    ":\u0003\u0002\u0002\u0002\u000e\u000f\u0005\u0004\u0003\u0002\u000f",
    "\u0010\u0007\u0002\u0002\u0003\u0010\u0003\u0003\u0002\u0002\u0002\u0011",
    "\u0016\u0005\u0006\u0004\u0002\u0012\u0013\u0007\u0007\u0002\u0002\u0013",
    "\u0015\u0005\u0004\u0003\u0002\u0014\u0012\u0003\u0002\u0002\u0002\u0015",
    "\u0018\u0003\u0002\u0002\u0002\u0016\u0014\u0003\u0002\u0002\u0002\u0016",
    "\u0017\u0003\u0002\u0002\u0002\u0017\u0005\u0003\u0002\u0002\u0002\u0018",
    "\u0016\u0003\u0002\u0002\u0002\u0019\u001e\u0005\b\u0005\u0002\u001a",
    "\u001b\u0007\u0006\u0002\u0002\u001b\u001d\u0005\b\u0005\u0002\u001c",
    "\u001a\u0003\u0002\u0002\u0002\u001d \u0003\u0002\u0002\u0002\u001e",
    "\u001c\u0003\u0002\u0002\u0002\u001e\u001f\u0003\u0002\u0002\u0002\u001f",
    "\u0007\u0003\u0002\u0002\u0002 \u001e\u0003\u0002\u0002\u0002!\"\u0007",
    "\u0017\u0002\u0002\"#\u0005\f\u0007\u0002#$\u0005\n\u0006\u0002$7\u0003",
    "\u0002\u0002\u0002%&\u0007\u0012\u0002\u0002&\'\u0005\u0004\u0003\u0002",
    "\'(\u0007\u0013\u0002\u0002(7\u0003\u0002\u0002\u0002)*\u0007\u0017",
    "\u0002\u0002*+\u0005\f\u0007\u0002+,\u0007\u0010\u0002\u0002,1\u0005",
    "\n\u0006\u0002-.\u0007\u0003\u0002\u0002.0\u0005\n\u0006\u0002/-\u0003",
    "\u0002\u0002\u000203\u0003\u0002\u0002\u00021/\u0003\u0002\u0002\u0002",
    "12\u0003\u0002\u0002\u000224\u0003\u0002\u0002\u000231\u0003\u0002\u0002",
    "\u000245\u0007\u0011\u0002\u000257\u0003\u0002\u0002\u00026!\u0003\u0002",
    "\u0002\u00026%\u0003\u0002\u0002\u00026)\u0003\u0002\u0002\u00027\t",
    "\u0003\u0002\u0002\u000289\t\u0002\u0002\u00029\u000b\u0003\u0002\u0002",
    "\u0002:;\t\u0003\u0002\u0002;\r\u0003\u0002\u0002\u0002\u0006\u0016",
    "\u001e16"].join("");


const atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

const decisionsToDFA = atn.decisionToState.map( (ds, index) => new antlr4.dfa.DFA(ds, index) );

const sharedContextCache = new antlr4.PredictionContextCache();

export default class FilterParser extends antlr4.Parser {

    static grammarFileName = "Filter.g4";
    static literalNames = [ null, "','", "'true'", "'false'", "'and'", "'or'", 
                            "'<'", "'>'", "'='", "'!='", "'in'", "'starts'", 
                            "'ends'", "'/'", "'['", "']'", "'('", "')'" ];
    static symbolicNames = [ null, null, "TRUE", "FALSE", "AND", "OR", "LT", 
                             "GT", "EQ", "NEQ", "IN", "STARTS", "ENDS", 
                             "PATHSEP", "LBRACK", "RBRACK", "LPAREN", "RPAREN", 
                             "INT", "FLOAT", "STRING", "ID", "WS" ];
    static ruleNames = [ "expression", "or_expression", "and_expression", 
                         "term", "atom", "operator" ];

    constructor(input) {
        super(input);
        this._interp = new antlr4.atn.ParserATNSimulator(this, atn, decisionsToDFA, sharedContextCache);
        this.ruleNames = FilterParser.ruleNames;
        this.literalNames = FilterParser.literalNames;
        this.symbolicNames = FilterParser.symbolicNames;
    }

    get atn() {
        return atn;
    }



	expression() {
	    let localctx = new ExpressionContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 0, FilterParser.RULE_expression);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 12;
	        this.or_expression();
	        this.state = 13;
	        this.match(FilterParser.EOF);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	or_expression() {
	    let localctx = new Or_expressionContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 2, FilterParser.RULE_or_expression);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 15;
	        this.and_expression();
	        this.state = 20;
	        this._errHandler.sync(this);
	        var _alt = this._interp.adaptivePredict(this._input,0,this._ctx)
	        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
	            if(_alt===1) {
	                this.state = 16;
	                this.match(FilterParser.OR);
	                this.state = 17;
	                this.or_expression(); 
	            }
	            this.state = 22;
	            this._errHandler.sync(this);
	            _alt = this._interp.adaptivePredict(this._input,0,this._ctx);
	        }

	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	and_expression() {
	    let localctx = new And_expressionContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 4, FilterParser.RULE_and_expression);
	    var _la = 0; // Token type
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 23;
	        this.term();
	        this.state = 28;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        while(_la===FilterParser.AND) {
	            this.state = 24;
	            this.match(FilterParser.AND);
	            this.state = 25;
	            this.term();
	            this.state = 30;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	term() {
	    let localctx = new TermContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 6, FilterParser.RULE_term);
	    var _la = 0; // Token type
	    try {
	        this.state = 52;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,3,this._ctx);
	        switch(la_) {
	        case 1:
	            this.enterOuterAlt(localctx, 1);
	            this.state = 31;
	            this.match(FilterParser.ID);
	            this.state = 32;
	            this.operator();
	            this.state = 33;
	            this.atom();
	            break;

	        case 2:
	            this.enterOuterAlt(localctx, 2);
	            this.state = 35;
	            this.match(FilterParser.LPAREN);
	            this.state = 36;
	            this.or_expression();
	            this.state = 37;
	            this.match(FilterParser.RPAREN);
	            break;

	        case 3:
	            this.enterOuterAlt(localctx, 3);
	            this.state = 39;
	            this.match(FilterParser.ID);
	            this.state = 40;
	            this.operator();
	            this.state = 41;
	            this.match(FilterParser.LBRACK);
	            this.state = 42;
	            this.atom();
	            this.state = 47;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            while(_la===FilterParser.T__0) {
	                this.state = 43;
	                this.match(FilterParser.T__0);
	                this.state = 44;
	                this.atom();
	                this.state = 49;
	                this._errHandler.sync(this);
	                _la = this._input.LA(1);
	            }
	            this.state = 50;
	            this.match(FilterParser.RBRACK);
	            break;

	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	atom() {
	    let localctx = new AtomContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 8, FilterParser.RULE_atom);
	    var _la = 0; // Token type
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 54;
	        _la = this._input.LA(1);
	        if(!((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << FilterParser.TRUE) | (1 << FilterParser.FALSE) | (1 << FilterParser.INT) | (1 << FilterParser.FLOAT) | (1 << FilterParser.STRING) | (1 << FilterParser.ID))) !== 0))) {
	        this._errHandler.recoverInline(this);
	        }
	        else {
	        	this._errHandler.reportMatch(this);
	            this.consume();
	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	operator() {
	    let localctx = new OperatorContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 10, FilterParser.RULE_operator);
	    var _la = 0; // Token type
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 56;
	        _la = this._input.LA(1);
	        if(!((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << FilterParser.LT) | (1 << FilterParser.GT) | (1 << FilterParser.EQ) | (1 << FilterParser.NEQ) | (1 << FilterParser.IN) | (1 << FilterParser.STARTS) | (1 << FilterParser.ENDS))) !== 0))) {
	        this._errHandler.recoverInline(this);
	        }
	        else {
	        	this._errHandler.reportMatch(this);
	            this.consume();
	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}


}

FilterParser.EOF = antlr4.Token.EOF;
FilterParser.T__0 = 1;
FilterParser.TRUE = 2;
FilterParser.FALSE = 3;
FilterParser.AND = 4;
FilterParser.OR = 5;
FilterParser.LT = 6;
FilterParser.GT = 7;
FilterParser.EQ = 8;
FilterParser.NEQ = 9;
FilterParser.IN = 10;
FilterParser.STARTS = 11;
FilterParser.ENDS = 12;
FilterParser.PATHSEP = 13;
FilterParser.LBRACK = 14;
FilterParser.RBRACK = 15;
FilterParser.LPAREN = 16;
FilterParser.RPAREN = 17;
FilterParser.INT = 18;
FilterParser.FLOAT = 19;
FilterParser.STRING = 20;
FilterParser.ID = 21;
FilterParser.WS = 22;

FilterParser.RULE_expression = 0;
FilterParser.RULE_or_expression = 1;
FilterParser.RULE_and_expression = 2;
FilterParser.RULE_term = 3;
FilterParser.RULE_atom = 4;
FilterParser.RULE_operator = 5;

class ExpressionContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = FilterParser.RULE_expression;
    }

	or_expression() {
	    return this.getTypedRuleContext(Or_expressionContext,0);
	};

	EOF() {
	    return this.getToken(FilterParser.EOF, 0);
	};

	enterRule(listener) {
	    if(listener instanceof FilterListener ) {
	        listener.enterExpression(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof FilterListener ) {
	        listener.exitExpression(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof FilterVisitor ) {
	        return visitor.visitExpression(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class Or_expressionContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = FilterParser.RULE_or_expression;
    }

	and_expression() {
	    return this.getTypedRuleContext(And_expressionContext,0);
	};

	OR = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(FilterParser.OR);
	    } else {
	        return this.getToken(FilterParser.OR, i);
	    }
	};


	or_expression = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(Or_expressionContext);
	    } else {
	        return this.getTypedRuleContext(Or_expressionContext,i);
	    }
	};

	enterRule(listener) {
	    if(listener instanceof FilterListener ) {
	        listener.enterOr_expression(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof FilterListener ) {
	        listener.exitOr_expression(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof FilterVisitor ) {
	        return visitor.visitOr_expression(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class And_expressionContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = FilterParser.RULE_and_expression;
    }

	term = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(TermContext);
	    } else {
	        return this.getTypedRuleContext(TermContext,i);
	    }
	};

	AND = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(FilterParser.AND);
	    } else {
	        return this.getToken(FilterParser.AND, i);
	    }
	};


	enterRule(listener) {
	    if(listener instanceof FilterListener ) {
	        listener.enterAnd_expression(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof FilterListener ) {
	        listener.exitAnd_expression(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof FilterVisitor ) {
	        return visitor.visitAnd_expression(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class TermContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = FilterParser.RULE_term;
    }

	ID() {
	    return this.getToken(FilterParser.ID, 0);
	};

	operator() {
	    return this.getTypedRuleContext(OperatorContext,0);
	};

	atom = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(AtomContext);
	    } else {
	        return this.getTypedRuleContext(AtomContext,i);
	    }
	};

	LPAREN() {
	    return this.getToken(FilterParser.LPAREN, 0);
	};

	or_expression() {
	    return this.getTypedRuleContext(Or_expressionContext,0);
	};

	RPAREN() {
	    return this.getToken(FilterParser.RPAREN, 0);
	};

	LBRACK() {
	    return this.getToken(FilterParser.LBRACK, 0);
	};

	RBRACK() {
	    return this.getToken(FilterParser.RBRACK, 0);
	};

	enterRule(listener) {
	    if(listener instanceof FilterListener ) {
	        listener.enterTerm(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof FilterListener ) {
	        listener.exitTerm(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof FilterVisitor ) {
	        return visitor.visitTerm(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class AtomContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = FilterParser.RULE_atom;
    }

	ID() {
	    return this.getToken(FilterParser.ID, 0);
	};

	INT() {
	    return this.getToken(FilterParser.INT, 0);
	};

	FLOAT() {
	    return this.getToken(FilterParser.FLOAT, 0);
	};

	STRING() {
	    return this.getToken(FilterParser.STRING, 0);
	};

	TRUE() {
	    return this.getToken(FilterParser.TRUE, 0);
	};

	FALSE() {
	    return this.getToken(FilterParser.FALSE, 0);
	};

	enterRule(listener) {
	    if(listener instanceof FilterListener ) {
	        listener.enterAtom(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof FilterListener ) {
	        listener.exitAtom(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof FilterVisitor ) {
	        return visitor.visitAtom(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class OperatorContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = FilterParser.RULE_operator;
    }

	LT() {
	    return this.getToken(FilterParser.LT, 0);
	};

	GT() {
	    return this.getToken(FilterParser.GT, 0);
	};

	EQ() {
	    return this.getToken(FilterParser.EQ, 0);
	};

	NEQ() {
	    return this.getToken(FilterParser.NEQ, 0);
	};

	IN() {
	    return this.getToken(FilterParser.IN, 0);
	};

	STARTS() {
	    return this.getToken(FilterParser.STARTS, 0);
	};

	ENDS() {
	    return this.getToken(FilterParser.ENDS, 0);
	};

	enterRule(listener) {
	    if(listener instanceof FilterListener ) {
	        listener.enterOperator(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof FilterListener ) {
	        listener.exitOperator(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof FilterVisitor ) {
	        return visitor.visitOperator(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}




FilterParser.ExpressionContext = ExpressionContext; 
FilterParser.Or_expressionContext = Or_expressionContext; 
FilterParser.And_expressionContext = And_expressionContext; 
FilterParser.TermContext = TermContext; 
FilterParser.AtomContext = AtomContext; 
FilterParser.OperatorContext = OperatorContext; 
