/* eslint-disable eqeqeq */

import { TerminalNode } from "antlr4ts/tree";

export function computeTokenPosition(parseTree, tokens, caretPosition, identifierTokenTypes = []) {
  if (parseTree instanceof TerminalNode) {
    return computeTokenPositionOfTerminal(parseTree, tokens, caretPosition, identifierTokenTypes);
  } else {
    return computeTokenPositionOfChildNode(parseTree, tokens, caretPosition, identifierTokenTypes);
  }
}

function positionOfToken(token, text, caretPosition, identifierTokenTypes, parseTree) {
  let start = token.charPositionInLine;
  let stop = token.charPositionInLine + text.length;
  if (token.line == caretPosition.line && start <= caretPosition.column && stop >= caretPosition.column) {
    let index = token.tokenIndex;
    if (identifierTokenTypes.includes(token.type)) {
      index--;
    }
    return {
      index: index,
      context: parseTree,
      text: text.substring(0, caretPosition.column - start)
    };
  } else {
    return undefined;
  }
}

function computeTokenPositionOfTerminal(parseTree, tokens, caretPosition, identifierTokenTypes) {
  let token = parseTree.symbol;
  let text = parseTree.text;
  return positionOfToken(token, text, caretPosition, identifierTokenTypes, parseTree);
}

function computeTokenPositionOfChildNode(parseTree, tokens, caretPosition, identifierTokenTypes) {
  if ((parseTree.start && parseTree.start.line > caretPosition.line) ||
    (parseTree.stop && parseTree.stop.line < caretPosition.line)) {
    return undefined;
  }
  for (let i = 0; i < parseTree.childCount; i++) {
    let position = computeTokenPosition(parseTree.getChild(i), tokens, caretPosition, identifierTokenTypes);
    if (position !== undefined) {
      return position;
    }
  }
  if (parseTree.start && parseTree.stop) {
    for (let i = parseTree.start.tokenIndex; i <= Math.max(parseTree.start.tokenIndex, parseTree.stop.tokenIndex); i++) {
      let pos = positionOfToken(tokens.get(i), tokens.get(i).text, caretPosition, identifierTokenTypes, parseTree);
      if (pos) {
        return pos;
      }
    }
  }
  return undefined;
}
