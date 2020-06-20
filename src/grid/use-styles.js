import {createUseStyles} from 'react-jss';

export default createUseStyles({

  Grid: {
    '--grid-heading-border-color': '#bbb',
    '--grid-cell-background': 'white',
    '--grid-header-cell-background': 'white',
    '--grid-cell-border-color': '#d4d4d4',
    '--header-cell-highlight-bg': 'rgb(66, 139, 202)',
    '--grid-cell-highlight-bg': 'rgba(66, 139, 202, .5)',

    backgroundColor: 'white',
    position: 'absolute',
    left: 50,
    top: 50,
    fontFamily: 'Roboto',
    fontSize: '0.825em',
    '&.scrolling-x': {
      '& $headerContainer': {
        display: 'none'
      },
      '& $Viewport': {
        overflowY: 'hidden !important',
        top: '0 !important'
      },
      '& $Canvas $ColumnGroupHeader': {
        display: 'block'
      },
      '& $canvasContentWrapper': {
        position: 'relative'
      }
    } 
  },

  headerContainer: {
    whiteSpace: 'nowrap',
    '& $ColumnGroupHeader': {
      display: 'inline-block'
    }
  },

  ColumnGroupHeader: {
    verticalAlign: 'top',
    overflow: 'hidden',
  },

  // headerCells: {
  //   display: 'flex'
  //  },

   Viewport : {
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    overflowX: 'hidden',
    overflowY: 'auto',
   },

   scrollingCanvasContainer: {
    whiteSpace: 'nowrap',
    transform: 'translate3d(0, 0, 0)'
   },

   Canvas: {
    display: 'inline-block',
    position: 'sticky',
    top: 0,
    verticalAlign: 'top',
    '& $ColumnGroupHeader': {
      display: 'none',
      position: 'absolute',
      top: 0
    }
  },

  fixed: {
    '& $canvasContentWrapper': {
      overflow: 'hidden'
    },
    '& $GridCell': {
      backgroundColor: '#efeded'
    }
  },

  scrollable: {
    overflowX: 'auto',
    overflowY: 'hidden',
    '& $canvasContent': {
      position: 'relative'
    }
  },

  canvasContentWrapper: {},

  canvasContent: {},

  GridRow: {
    boxSizing: 'border-box',
    left: 0,
    outline: 0,
    position: 'absolute',
    top: 0,
    whiteSpace: 'nowrap',
    width: '100%'
  
  },

  virtualPadding: {
    display: 'inline-block',
    height: '100%'
  },

  HeaderCell: {
    alignItems: 'stretch',
    background: 'var(--grid-header-cell-background)',
    borderBottom: 'solid 1px var(--grid-heading-border-color)',
    borderRight: '1px solid var(--grid-heading-border-color)',
    boxSizing: 'border-box',
    display: 'inline-flex',
    fontWeight: 'bold',
    height: '100%',
    position: 'relative',
    verticalAlign: 'top',
    '&$noBottomBorder': {
      borderBottom: 'solid 1px transparent'
    },
    '&.resizing': {
      backgroundColor: 'var(--header-cell-highlight-bg)'
    }
  },

  noBottomBorder: {},

  innerHeaderCell: {
    flex: '1 1 auto',
    fontWeight: 'bold',
    overflow: 'hidden',
    padding: '0 12px',
    position: 'relative',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },

  cellWrapper: {
    alignItems: 'center',
    display: 'flex',
    height: '100%',
    verticalAlign: 'top',
    whiteSpace: 'nowrap'
  },

  resizeHandle: {
    backgroundColor: 'rgba(180, 180, 180, 0.05)',
    cursor: 'col-resize',
    flex: '0 0 8px',
    position: 'relative',
    right: -5,
    zIndex: 1
  },

  GridCell: {
      '--border-color': '#d4d4d4',
      '--border-color-selected': 'rgb(46, 100, 139)',
      alignItems: 'center',
      backgroundColor: 'var(--grid-cell-background)',
      boxSizing: 'border-box',
      borderColor: 'var(--border-color)',
      borderStyle: 'solid',
      borderWidth: '0 1px 1px 0',
      cursor: 'default',
      display: 'inline-flex',
      fontSize: 12,
      fontWeight: 'normal',
      height: '100%',
      padding: '0 12px',
      position: 'relative',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      verticalAlign: 'top',
      whiteSpace: 'nowrap',
      zIndex: 0,
      '&.resizing': {
        backgroundColor: 'var(--grid-cell-highlight-bg)'
      }
  },

  Vanishing: {
    borderStyle: 'none',
    color: 'transparent',
    padding: 0,
    transition: 'width ease .3s',
    width: '0 !important'
  },

  DraggedColumn: {
    backgroundColor: 'ivory',
    opacity: 0.4
  },

  ColumnBearer: {
    backgroundColor: 'white',
    boxShadow: '0 6px 12px rgba(0,0,0,0.275)',
    position: 'absolute',
    overflow: 'hidden',
    zIndex: 150,
    '& $HeaderCell': {
      backgroundColor: 'var(--header-cell-highlight-bg)'
    }  
  },

  InsertIndicator: {
    backgroundColor: 'green',
    height: '100%',
    position: 'absolute',
    top: 0,
    transition: 'left ease-in-out .2s', 
    width: 4,
  }

});