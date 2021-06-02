import React from 'react';
import {ParsedInput, ParserProvider, parseFilter, getTokenTypes} from '@heswell/antlr-input';
import filterSuggestions from './filter-suggestion-factory';

export default {
  title: "Antlr/ParsedInput",
  component: ParsedInput,
};

//TODO combine parser and getTokenTypes intoi a parser
export const ParsedFilterInput = () =>
  <ParserProvider parser={parseFilter} getTokenTypes={getTokenTypes}>
    <ParsedInput suggestionProvider={filterSuggestions}/>
  </ParserProvider>

