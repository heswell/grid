
import {TerminalNode} from "antlr4ts/tree";

export function computeTokenIndex(parseTree, caretPosition) {
    if(parseTree instanceof TerminalNode) {
        return computeTokenIndexOfTerminalNode(parseTree, caretPosition);
    } else {
        return computeTokenIndexOfChildNode(parseTree, caretPosition);
    }
}


function computeTokenIndexOfTerminalNode(parseTree, caretPosition) {
  let start = parseTree.symbol.charPositionInLine;
  let stop = parseTree.symbol.charPositionInLine + parseTree.text.length;
  if (parseTree.symbol.line == caretPosition.line && start <= caretPosition.column && stop >= caretPosition.column) {
      return {index: parseTree.symbol.tokenIndex, text: parseTree.text.substring(0, caretPosition.column - start)};
  } else {
      return undefined;
  }
}

function computeTokenIndexOfChildNode(parseTree, caretPosition) {
  for (let i = 0; i < parseTree.childCount; i++) {
      let index = computeTokenIndex(parseTree.getChild(i), caretPosition);
      if (index !== undefined) {
          return index;
      }
  }
  return undefined;
}
