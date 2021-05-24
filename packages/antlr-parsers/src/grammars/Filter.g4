grammar Filter;

TRUE : 'true';
FALSE : 'false';
AND : 'and';
OR : 'or';
LT : '<';
GT : '>';
EQ : '=';
NEQ : '!=';
IN : 'in';
STARTS : 'starts';
ENDS : 'ends';
PATHSEP : '/';
LBRACK : '[';
RBRACK : ']';
LPAREN : '(';
RPAREN : ')';
COMMA : ',';

expression : or_expression EOF;

or_expression : and_expression (OR or_expression)*;

and_expression : term (AND term)*;

term : col_val_expression | col_set_expression | LPAREN or_expression RPAREN;

col_set_expression: column IN LBRACK atoms RBRACK;

col_val_expression: column (operator atom)?;

atoms: atom (COMMA atom)*;

atom : ID | INT | FLOAT | STRING | TRUE | FALSE;

column: ID;

operator : LT | GT | EQ | NEQ | STARTS | ENDS;

INT : '0'..'9'+;
FLOAT : ('0'..'9')+ '.' ('0'..'9')*;
STRING : '"'('a'..'z'|'A'..'Z'|'0'..'9'|'.'|'-')* '"';
ID : ('a'..'z'|'A'..'Z'|'_') ('a'..'z'|'A'..'Z'|'0'..'9'|'_'|'.'|'-')*;
WS  :   [ \t\r\n]+ -> skip;
