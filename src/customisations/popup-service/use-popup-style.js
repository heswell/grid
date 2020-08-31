import { createUseStyles } from 'react-jss';

export default createUseStyles(theme => ({
  popup: {
    boxShadow: '0 6px 12px rgba(0,0,0,0.175)',
    position: 'absolute',
    top:0,
    left:0,
    width:0,
    height:0,
    overflow: 'visible',
    zIndex: 1000
  }
}))