import { createUseStyles } from 'react-jss';

export default createUseStyles(_theme => ({

  FilterPanel: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Roboto',
    fontSize: '12px',
    width: 200,
    height: 400,
    '& button': {
      borderRadius: 0
    },
    '& .filter-inner': {
      backgroundColor: 'white',
      boxShadow: '2px 2px 5px -1px rgba(0,0,0,0.52)',
      display: 'flex'
    },
    '& .footer': {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'flex-end',
      '& .filter-done-button': {
        margin: '0 3px 0 auto'
      }
    }
  },

  FilterPanelHeader: {
    height: 32, // needs to match headerHeight
    '& .col-header-inner': {
      alignItems: 'center',
      backgroundColor: 'rgb(66, 139, 202)',
      display: 'flex',
      height: '100%',
      lineHeight: '24px',
      paddingLeft: '14px',
      boxSizing: 'border-box',
      borderBottom: 'solid 1px black',
      position: 'relative',
      zIndex: 1,
      color: 'rgb(51,51,51)'
    }
  }, 
  
  active: {},

  FilterToolbar: {
    cursor: 'pointer',
    backgroundColor: 'white',
    borderTop: 'solid black 1px',
    borderBottom: 'solid #999 1px',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    '& .search-text': {
      position: 'relative',
      height: '100%',
      boxSizing: 'border-box',
      border: 'none',
      outline: 'none'
    }
  },

  filterButton: {
    flex: '0 0 18px',
    cursor: 'pointer',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
    color: '#888',
    '& .material-icons': {
      fontSize: '16px',
      position: 'relative',
      left: 1
    }
  },

  filterInputContainer:{
    flex: '1 1 auto',
    padding: '0 6px'
  },

  filterInput: {
    border: 'none',
    height: '100%',
    outline: 'none',
    padding: 0,
    width: '100%'
  },
  
  filter: {
    alignItems: 'center',
    '&$active $filterButton': {
      color: 'black'
    }
  },
  
  filterClearButton: {
    cursor: 'pointer',
    fontSize: '12px',
    height: '1em',
    marginRight: 3,
    width: '1em',
    '& .material-icons': {
      fontSize: 'inherit'
    }
  },

  FilterCounts: {
    alignItems: 'center',
    borderTop: 'solid 1px #999',
    color: '#666',
    display: 'flex',
    fontSize: '.75em',
    lineHeight: '16px',
    '& .filter-row-counts': {
      flex: '1 1 0',
      paddingLeft: 6
    },
    '& .filter-row-table':{
      display: 'table',
      width: '100%',
      '& > div':{
        display: 'table-row',
        '& > span': {
          display: 'table-cell'
        }
      }
    },
    '& .data-row-counts': {
      flex: '1 1 0',
      marginLeft: 'auto',
      textAlign: 'right', 
      paddingRight: 27
  
    }

  },

  SetFilter: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    fontSize: '16px'
  },

  SetList: {
    position: 'relative'
  }
  
  
}));