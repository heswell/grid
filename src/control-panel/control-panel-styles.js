import {createUseStyles} from 'react-jss';

export default createUseStyles({
  root: {
    background: 'white',
    bottom: 0,
    borderTop: 'solid 2px #ccc',
    display: 'flex',
    flexDirection: 'column',
    height: 200,
    left: 0,
    overflow: 'hidden',
    position: 'absolute',
    right: 0
  },
  field: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row'
  },
  header: {
    borderBottom: 'solid 1px #ccc',
    flex: '0 0 48px',
    padding: '0 6px'
  },
  body: {
    display: 'flex',
    flex: '1 1 auto',
  },
  location : {
    marginLeft: 'auto'
  },
  tabs: {
    borderRight: 'solid 1px #ccc',
    flex: '0 0 120px',

  },
  tabPanel: {
    flex: '1 1 auto',
    padding: 12
  }
});