module.exports = {
  root: './build',

  autoprefixerConfig: ['last 3 version', '> 1%'],
  cleanCssConfig: 2,
  smartset: {
    outputStyle: 'scss', /* less || scss || sass || styl */
    columns: 12, /* number of grid columns */
    offset: '2rem', /* gutter width px || % || rem */
    mobileFirst: false, /* mobileFirst ? 'min-width' : 'max-width' */
    container: {
      maxWidth: '1280px', /* max-width оn very large screen */
      fields: '1rem'/*'30px'  side fields */
    },
    breakPoints: {
      lg: {
        width: '1280px', /* -> @media (max-width: 1100px) */
      },
      md: {
        width: '960px'
      },
      sm: {
        width: '780px',
        /*fields: '15px'  set fields only if you want to change container.fields */
      },
      xs: {
        width: '560px'
      }
      /*
      We can create any quantity of break points.

      some_name: {
          width: 'Npx',
          fields: 'N(px|%|rem)',
          offset: 'N(px|%|rem)'
      }
      */
    }
  }
};
//, 'ie 8', 'ie 9', 'Opera 12.1'