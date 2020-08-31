import { createUseStyles } from 'react-jss';

const svg = path => `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="18px" height="18px">${path}</svg>')`;
const checkbox = svg('<path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>');
const checked = svg('<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM17.99 9l-1.41-1.42-6.59 6.59-2.58-2.57-1.42 1.41 4 3.99z"/>');
const indeterminate = svg('<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 11h10v2H7z"/>');

export default createUseStyles(theme => ({
  Checkbox: {
    outline: 'none',
    backgroundImage: checkbox,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '3px 2px',
    '&.checked': {
      backgroundImage: checked
    },
    '&.indeterminate': {
      backgroundImage: indeterminate
    },
    '&.emptyRow': {
      backgroundImage: 'none'
    }
  }
}));