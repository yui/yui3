// to handle the case where BASE === 'https://wellscontent.wellsfargo.com/wria/combo'
var WF2_BASE = Y.config.base.charAt(Y.config.base.length - 1) === '/' ?
        Y.config.base :
        Y.config.base + '/',
    WF2_COMBINE = "@WF2_COMBINE@" === "true",
    WF2_COMBO_BASE = WF2_BASE + '@WF2_COMBOPATH@',
    WF2_GALLERY_BASE = WF2_BASE + '@WF2GALLERY_ROOTDIR@',
    WF2_GALLERY_COMBO_BASE = WF2_BASE + '@WF2GALLERY_COMBOPATH@';

Y.applyConfig({
  base: WF2_BASE,
  combine: WF2_COMBINE,
  comboBase: WF2_COMBO_BASE,
  groups: {
    'wellsfargo-gallery': {
      base: WF2_GALLERY_BASE,
      combine: WF2_COMBINE,
      comboBase: WF2_GALLERY_COMBO_BASE,
      patterns: {
        'wf2-gallery-': {},
        'lang/wf2-gallery-': {},
        'wf2-gallerycss-': {
          type: 'css'
        }
      },
      root: ''
    }
  },
  root: '',
  skin: {
    defaultSkin: 'sketch',
    overrides: {        /*@DBG*/
      console: ['sam']  /*@DBG*/
    }                   /*@DBG*/
  }
});
