import { createUseStyles } from 'react-jss';

export default createUseStyles(theme => ({
  Grid: {
    '--grid-background': theme['--grid-background'] || 'white',
    '--grid-text-color': theme['--grid-text-color'] || 'black',
    '--grid-font-size': theme['--grid-font-size'] || '0.75em',
    '--grid-heading-border-color': theme['--grid-heading-border-color'],
    '--grid-cell-border-color': theme['--grid-cell-border-color'] || '#d4d4d4',
    '--header-cell-highlight-bg': theme['--header-cell-highlight-bg'],
    '--grid-cell-highlight-bg': theme['--grid-cell-highlight-bg'],
    '--grid-header-background': theme['--grid-header-background'] || theme['--grid-background'] || 'white',

    backgroundColor: 'var(--grid-background)',
    boxSizing: 'border-box',
    position: 'absolute',
    fontFamily: 'Roboto',
    fontSize: 'var(--grid-font-size)',
    overflow: 'hidden',
    '&.scrolling-x': {
      '& $Viewport': {
        overflowY: 'hidden !important',
        height: '100% !important'
      },
      '& $Canvas $ColumnGroupHeader': {
        position: 'relative'
      },
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
    backgroundColor: 'var(--grid-header-background)'
  },

  headerCells: {
    display: 'flex'
  },

  Viewport: {
    // position: 'absolute',
    // left: 0,
    // bottom: 0,
    // right: 0,
    overflowX: 'hidden',
    overflowY: 'auto',
  },

  scrollingCanvasContainer: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },

  Canvas: {
    display: 'inline-block',
    // position: 'absolute',
    top: 0,
    verticalAlign: 'top',
    '& $ColumnGroupHeader': {
      position: 'absolute',
      top: 0
    },
  },

  fixed: {
    overflow: 'hidden',
    '& $canvasContentWrapper': {
      overflow: 'hidden'
    },
    '& $GridCell': {
      backgroundColor: '#efeded'
    }
  },

  scrollable: {
    overflowX: 'auto',
    overscrollBehaviorX: 'contain',
    overflowY: 'hidden'
  },

  canvasContentWrapper: {},

  canvasContent: {
    position: 'relative'
  },

  GridRow: {
    boxSizing: 'border-box',
    left: 0,
    outline: 0,
    position: 'absolute',
    top: 0,
    whiteSpace: 'nowrap',
    width: '100%',
    '&.group $GridCell:first-child': {
      padding: '0 6px 0 3px'
    }

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
    color: 'var(--grid-text-color)',
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

  GroupHeaderCell: {
    overflow: 'hidden',
    '& .inner-container': {
      overflow: 'hidden',
      height: '100%',
      width: '100%',
      display: 'inline-flex',
      alignItems: 'stretch'
    },
    '& .ColHeader': {
      display: 'inline-block',
      backgroundColor: 'inherit',
      position: 'relative',
      paddingRight: 8,
      flex: '0 1 auto'
    },
    '& .ColHeader.first': {
      clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 0 100% )',
      zIndex: 1
    },
    '& .ColHeader:not(.first)': {
      marginLeft: -6,
      paddingLeft: 6,
      clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 0 100%, 8px 50% )'
    },
    '& .ColHeader:nth-child(odd)': {
      backgroundColor: 'rgba(136, 136, 136,.5)'
    },
    '& .ColHeader:nth-child(even)': {
      backgroundColor: 'rgba(160,160,160,.3)'
    },
    '& .ColHeader:hover': {
      backgroundColor: 'rgb(66, 139, 202)',
      color: 'white'
    },
    '& .ColHeaderLabel': {
      alignItems: 'center',
      display: 'inline-flex',
      height: '100%',
      verticalAlign: 'top'
    },
    '& .toggle-icon, .remove-icon': {
      fontSize: '16px',
      height: '100%',
      lineHeight: '32px',
      cursor: 'pointer',
      verticalAlign: 'top'

    },
    '& .remove-icon': {
      visibility: 'hidden',
      fontSize: '16px',
      paddingLeft: 3
    },
    '& .ColHeader:hover .remove-icon': {
      visibility: 'visible'
    } 

    
  },

  noBottomBorder: {},

  innerHeaderCell: {
    flex: '1 1 auto',
    fontWeight: 'bold',
    overflow: 'hidden',
    padding: '0 12px 0 14px',
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
    alignItems: 'center',
    backgroundColor: 'var(--grid-cell-background)',
    boxSizing: 'border-box',
    borderColor: 'var(--grid-cell-border-color)',
    borderStyle: 'solid',
    borderWidth: '0 1px 1px 0',
    color: 'var(--grid-text-color)',
    cursor: 'default',
    display: 'inline-flex',
    fontWeight: 'bold',
    height: '100%',
    overflow: 'hidden',
    padding: '0 12px',
    position: 'relative',
    textOverflow: 'ellipsis',
    verticalAlign: 'top',
    whiteSpace: 'nowrap',
    zIndex: 0,
    '&$noBottomBorder': {
      borderBottom: 'solid 1px transparent'
    },
    '&.resizing': {
      backgroundColor: 'var(--header-cell-highlight-bg)'
    },
    '&.number': {
      textAlign: 'right'
    },
    '& .num': {
      display: 'inline-block',
      width: '100%'
    }
  },

  GridGroupCell: {
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1, 
    overflow: 'hidden',
    '& .icon': {
      fontSize: '16px',
      width: 12,
      marginRight: 6,
      lineHeight: '21px'
    },
    '& .group-value': {
      cursor: 'default',
      display: 'inline-block',
      maxWidth: 'calc(100% - 30px)',
      overflow: 'hidden',
      paddingRight: 3,
      textOverflow: 'ellipsis',
      verticalAlign:'top',
      whiteSpace: 'nowrap',
    }
  },

  noToggle: {
    '& $GridGroupCell:first-child': {
      marginLeft: 12
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
  },

  SortIndicator: {
    position: 'absolute',
    top: 2,
    left: -5,
    bottom: 0,
    width: 18,
  
    '&.single-col': {

    },
    '&.multi-col': {

    }
  },

  SortPosition: {
    fontSize: '10px',
    position: 'absolute',
    left: 9,
    top: 15  
  }

}));