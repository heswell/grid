import { createUseStyles } from 'react-jss';

export default createUseStyles(theme => ({
  background: {
    '&.$up1': {
      backgroundColor: 'green'
    },
    '&.$down1': {
      backgroundColor: 'red'
    }
  },
  flasher: {
    color: 'transparent',
    position: 'absolute',
    left:0,
    right:0,
    top:0,
    bottom:0,
    zIndex: -1,
    lineHeight: '2.1em'
  },
  up1:{
    '& $flasher' : {
      animationDuration: '3s',
      animationName : '$reactbgup1'
    },
    '&$arrowOnly': {
      ' & $flasher' : {
        animationDuration: '30s',
        animationName : '$reactarrowup1'
      }
    },
    '&$arrow': {
      ' & $flasher' : {
        animationDuration: '30s',
        animationName : '$reactbgarrowup1'
      }
    }
  },
  up2:{
    ' & $flasher' : {
      animationDuration: '3s',
      animationName : '$reactbgup2'
    },
    '&$arrowOnly': {
      ' & $flasher' : {
        animationDuration: '30s',
        animationName : '$reactarrowup2'
      }
    },
    '&$arrow': {
      ' & $flasher' : {
        animationDuration: '30s',
        animationName : '$reactbgarrowup2'
      }
    }
  },
  down1:{
    ' & $flasher' : {
      animationDuration: '3s',
      animationName : '$reactbgdown1'
    },
    '&$arrowOnly': {
      ' & $flasher' : {
        animationDuration: '30s',
        animationName : '$reactarrowdown1'
      }
    },
    '&$arrow': {
      ' & $flasher' : {
        animationDuration: '30s',
        animationName : '$reactbgarrowdown1'
      }
    }

  },
  down2:{
    ' & $flasher' : {
      animationDuration: '3s',
      animationName : '$reactbgdown2'
    },
    '&$arrowOnly': {
      ' & $flasher' : {
        animationDuration: '30s',
        animationName : '$reactarrowdown2'
      }
    },
    '&$arrow': {
      ' & $flasher' : {
        animationDuration: '30s',
        animationName : '$reactbgarrowdown2'
      }
    }
  },

  arrow: {},
  arrowOnly: {},
   
  "@keyframes reactbgup1": {
    from: {backgroundColor: 'green'},
    to: {backgroundColor: 'transparent'}
  },

  '@keyframes reactbgup2': {
    from: {backgroundColor: 'green'},
    to: {backgroundColor: 'transparent'}
  },
  
  '@keyframes reactbgdown1': {
    from: {backgroundColor: 'red'},
    to: {backgroundColor: 'transparent'}
  },
  
  '@keyframes reactbgdown2': {
    from: {backgroundColor: 'red'},
    to: {backgroundColor: 'transparent'}
  },
  
  '@keyframes reactarrowup1': {
    from: {color: 'green'},
    to: {color: 'transparent'}
  },
  
  '@keyframes reactarrowup2': {
    from: {color: 'green'},
    to: {color: 'transparent'}
  },
  
  '@keyframes reactarrowdown1': {
    from: {color: 'red'},
    to: {color: 'transparent'}
  },
  
  '@keyframes reactarrowdown2': {
    from: {color: 'red'},
    to: {color: 'transparent'}
  },
  
  '@keyframes reactbgarrowup1': {
    '0%': {color:'green', backgroundColor: 'green'},
    '20%': {color:'green', backgroundColor: 'transparent'},
    '100%': {color: 'transparent', backgroundColor: 'transparent'}
  },
  
  '@keyframes reactbgarrowup2': {
    '0%': {color:'green', backgroundColor: 'green'},
    '20%': {color:'green', backgroundColor: 'transparent'},
    '100%': {color: 'transparent', backgroundColor: 'transparent'}
  },
  
  '@keyframes reactbgarrowdown1': {
    '0%': {color:'red', backgroundColor: 'red'},
    '20%': {color:'red',backgroundColor: 'transparent'},
    '100%': {color: 'transparent', backgroundColor: 'transparent'}
  },
  
  '@keyframes reactbgarrowdown2': {
    '0%': {color:'red', backgroundColor: 'red'},
    '20%': {color:'red',backgroundColor: 'transparent'},
    '100%': {color: 'transparent', backgroundColor: 'transparent'}
  }
 
})/*,{name: 'background-cell'}*/);
