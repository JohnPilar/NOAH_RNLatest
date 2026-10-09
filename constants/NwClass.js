import {StyleSheet, Dimensions} from 'react-native';
import {Portal} from 'react-native-paper';

import Colors from './Colors';

//landscape tablet, 992px and up
var tabletLandscape = 900;

//portrait tablet 769px - 992px
var tabletPortait = 750;

//landscape phone, 577px - 771px
var phoneLandscape = 771;

//portrait phones, less than 576
var phonePortrait = 576;

const dimheight = Dimensions.get('window').height;
const dimwidth = Dimensions.get('window').width;

export const NwClass = StyleSheet.create({
  container: {
    fontSize: 18,
    color: Colors.black,
    padding: 40,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgb(37, 97, 156)',
    width: '100%',
    marginBottom: 10,
    alignItems: 'center',
    backgroundColor: Colors.container,
    fontFamily: 'AbadiMTStd',
  },
  br: {
    marginVertical: 5,
  },
  hr: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginHorizontal: 30,
  },
  hr2: {
    marginHorizontal: 0,
    borderBottomColor: '#8EBCEA',
    borderBottomWidth: 0.5,
    marginVertical: 20,
  },
  vr: {
    borderLeftColor: '#aaaaaa',
    borderLeftWidth: 0.5,
    marginHorizontal: 10,
  },
  hrDashed: {
    borderBottomColor: 'rgb(34,34,34)',
    borderBottomWidth: 1,
    marginHorizontal: 20,
    borderStyle: 'dashed',
    borderColor: 'rgb(34,34,34)',
  },
  sampleText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'AbadiMTStd',
    fontSize: 15,
  },
  sampleLight: {
    backgroundColor: '#25619c',
  },
  sampleDark: {
    backgroundColor: '#0d4469',
  },
  row: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  row_parent: {
    marginBottom: 15,
  },
  col: {
    padding: 5,
    textAlign: 'center',
    justifyContent: 'center',
    borderRadius: 0,
    borderWidth: 0,
  },
  col_parent: {
    padding: 0,
    display: 'flex',
  },
  margin_auto: {
    justifyContent: 'center',
  },

  col_1: {
    width: dimwidth > tabletLandscape ? '8.33333%' : dimwidth > tabletPortait ? '16.6666%' : '100%',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  col_2: {
    width: dimwidth > tabletLandscape ? '16.6666666667%' : dimwidth > tabletPortait ? '33.33%' : '100%',
  },
  col_3: {
    width: dimwidth > tabletLandscape ? '25%' : dimwidth > tabletPortait ? '50%' : '100%',
    borderWidth: 1,
    borderColor: 'transparent',
  },

  col_4: {
    width: dimwidth > tabletLandscape ? '33.3333%' : dimwidth > tabletPortait ? '66.66%' : '100%',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  col_5: {
    width: dimwidth > tabletLandscape ? '41.6666666667%' : dimwidth > tabletPortait ? '83.33%' : '100%',
  },
  col_6: {
    width: dimwidth > tabletLandscape ? '50%' : '100%',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  col_7: {
    width: dimwidth > tabletLandscape ? '58.3333333333%' : '100%',
  },
  col_8: {
    width: dimwidth > tabletLandscape ? '66.6666666667%' : '100%',
  },
  col_9: {
    width: dimwidth > tabletLandscape ? '75%' : '100%',
  },
  col_10: {
    width: dimwidth > tabletLandscape ? '83.3333333333%' : '100%',
  },
  col_11: {
    width: dimwidth > tabletLandscape ? '91.6666666667%' : '100%',
  },
  col_12: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'transparent',
  },

  col_6_MoB: {
    width: dimwidth > tabletPortait && dimwidth < tabletLandscape ? '80%' : '100%',
  },

  inlineBlockBtn: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  block: {
    width: '100%',
  },

  nk: {
    minHeight: 1,
    position: 'relative',
    alignSelf: 'flex-start',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  nk_modal_body: {
    padding: 10,
    paddingTop: 0,
  },
  nk_Select: {
    padding: 2,
    paddingLeft: 2,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#bfbfbf',
    backgroundColor: '#e2e2e2',
    // background: linear-gradient(to bottom, #ffffff, #e2e2e2);
  },
  nk_SelectText: {
    color: Colors.black,
    fontWeight: '500',
    fontSize: 15,
    fontFamily: 'AbadiMTStd',
  },
  nkPagination: {
    paddingVertical: 6,
    paddingHorizontal: 4,
    position: 'relative',
    flexDirection: 'row',
  },
  page_control: {
    position: 'relative',
    marginHorizontal: 5,
    minHeight: 30,
    minWidth: 30,
    borderRadius: 20,
    paddingHorizontal: 5,
  },
  page_controlText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#104b85',
    fontFamily: 'AbadiMTStd',
  },
  page_search: {
    position: 'relative',
    marginHorizontal: 5,
    minWidth: 30,
    minHeight: 30,
    borderRadius: 20,
    paddingHorizontal: 5,
  },
  page_search_text: {
    fontSize: 20,
    fontWeight: '600',
    color: '#104b85',
    fontFamily: 'AbadiMTStd',
  },
  page_of_text: {
    position: 'relative',
    minWidth: 30,
    minHeight: 30,
    borderRadius: 20,
    fontSize: 20,
    fontWeight: '600',
    color: '#104b85',
    fontFamily: 'AbadiMTStd',
  },
  found_record: {
    width: '100%',
    backgroundColor: '#708eac',
    padding: 9,
    borderRadius: 3,
  },
  found_recordText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'AbadiMTStd',
  },

  table_wrapper: {
    width: '100%',
    borderColor: '#cfd5da',
  },
  label: {
    color: '#333',
    // fontWeight: '100',
    fontSize: 12,
    marginTop: 0,
    paddingVertical: 6,
    paddingHorizontal: 2,
    fontFamily: 'Tahoma',
  },
  txtbox: {
    fontSize: 13,
    color: 'rgb(34, 34, 34)',
    paddingVertical: 3,
    paddingHorizontal: 4,
    borderRadius: 3,
    borderWidth: 0.6,
    borderColor: '#aaaaaa',
    fontFamily: 'AbadiMTStd',
  },
  txtarea: {
    height: 70,
    maxHeight: 160,
    lineHeight: 20,
  },
  btn_default: {
    height: 45,
    backgroundColor: Colors.btn_default,
    borderRadius: 4,
    marginTop: 3,
    marginRight: 5,
    marginBottom: 2,
    marginLeft: 0,
    paddingHorizontal: 15,
  },
  btnText_default: {
    fontSize: 16,
    color: Colors.white,
    textAlign: 'center',
    marginLeft: 2,
    fontFamily: 'AbadiMTStd',
  },
  btn_default_green: {
    backgroundColor: Colors.btn_default_green,
  },
  btn_default_orange: {
    backgroundColor: Colors.btn_default_orange,
  },
  btn_default_gray: {
    backgroundColor: Colors.btn_default_gray,
  },
  btn_default_darkblue: {
    backgroundColor: Colors.btn_default_darkblue,
  },
  btn_action: {
    paddingHorizontal: 8,
    height: 40,
    display: 'flex',
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 3,
    marginRight: 5,
    marginBottom: 2,
    marginLeft: 0,
    backgroundColor: Colors.btn_default,
  },
  btn_new: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn_Icon: {
    marginRight: 2,
  },
  btn_icon_action: {
    paddingHorizontal: 6,
    height: 40,
    display: 'flex',
    borderRadius: 4,
    alignItems: 'center',
    backgroundColor: '#d7ebff',
  },
  btn_title_with_icon: {
    flexDirection: dimwidth > tabletLandscape ? 'row' : 'column',
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },

  position_x_right: {
    justifyContent: 'flex-end',
  },
  position_x_left: {
    justifyContent: 'flex-start',
  },
  position_x_center: {
    justifyContent: 'center',
  },
  padding_x_5: {
    paddingHorizontal: 5,
  },
  padding_x_10: {
    paddingHorizontal: 10,
  },
  padding_x_15: {
    paddingHorizontal: 15,
  },
  padding_x_20: {
    paddingHorizontal: 20,
  },
  padding_x_25: {
    paddingHorizontal: 25,
  },
  padding_none: {
    padding: 0,
  },
  margin_y_5: {
    marginVertical: 5,
  },
  margin_y_10: {
    marginVertical: 10,
  },
  c_textarea_w_icon: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginRight: 10,
  },
  fullwidth: {
    width: '100%',
    flex: 1,
    alignSelf: 'stretch',
  },
  txtarea_icon: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 10,
  },
  tabs: {
    position: 'relative',
    padding: 10,
    backgroundColor: '#f2f7fd',
    borderRadius: 6,
    width: 400,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabs_Text: {
    marginBottom: 6,
    fontSize: 20,
    color: 'black',
    lineHeight: 22,
    paddingHorizontal: 2,
    fontWeight: '600',
    fontFamily: 'AbadiMTStd',
  },
  tabs_subText: {
    marginBottom: 15,
    position: 'relative',
    paddingHorizontal: 4,
    lineHeight: 18,
    fontSize: 14,
    fontFamily: 'AbadiMTStd',
    color: 'black',
  },
  tabs_content: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tabs_label: {
    position: 'relative',
    paddingHorizontal: 14,
    paddingVertical: 8,

    backgroundColor: 'transparent',
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  tabs_labelText: {
    fontWeight: '500',
    fontSize: 18,
    color: 'black',
    fontFamily: 'AbadiMTStd',
  },
  tabs_text: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 6,
    width: '100%',
    minHeight: 38,
  },
  tabs_textText: {
    fontSize: 15,
    fontFamily: 'AbadiMTStd',
  },
  mdl_error_msg: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 10,
    // overflow: 'hidden',
  },
  mdl_msg_wrap: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOffset: {
      width: 10,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 10,
    width: 400,
    margin: 5,
  },
  mdl_noWidth: {
    width: '100%',
    margin: 5,
  },
  mdl_msg_icon: {},
  mdl_msg_Text: {
    fontWeight: '900',
    fontSize: 24,
    color: '#f75948',
    marginVertical: 20,
    textAlign: 'center',
    fontFamily: 'AbadiMTStd',
  },
  mdl_msg_AlertText: {
    fontWeight: '900',
    fontSize: 24,
    color: '#39b364',
    marginVertical: 15,
    textAlign: 'center',
    fontFamily: 'AbadiMTStd',
  },
  hrAlert: {
    borderWidth: 1,
    marginVertical: 10,
    marginHorizontal: 0,
    padding: 0,
    borderColor: '#39b364',
  },

  mdl_error_txtmsg: {
    color: 'rgb(34,34,34)',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    fontFamily: 'AbadiMTStd',
  },
  mdl_btn: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },
  btn_error_yes: {
    backgroundColor: '#f75948',
    width: '45%',
    height: 40,
    borderRadius: 6,
    marginHorizontal: 10,
    marginTop: 10,
  },
  btn_error_yesText: {
    color: '#fff',
    fontWeight: '900',
    textAlign: 'center',
  },
  btn_error_no: {
    backgroundColor: '#ffb8b0',
    width: '45%',
    height: 40,
    borderRadius: 6,
    marginHorizontal: 10,
    marginTop: 10,
  },
  btn_error_noText: {
    color: '#f75948',
    fontWeight: '900',
    textAlign: 'center',
  },

  btn_save_yes: {
    backgroundColor: '#6c76e0',
    width: '45%',
    height: 40,
    borderRadius: 6,
    marginHorizontal: 10,
    marginTop: 10,
  },
  btn_save_yesText: {
    color: '#fff',
    fontWeight: '900',
    textAlign: 'center',
  },
  btn_save_no: {
    backgroundColor: '#cfd3ff',
    width: '45%',
    height: 40,
    borderRadius: 6,
    marginHorizontal: 10,
    marginTop: 10,
  },
  btn_save_noText: {
    color: '#6c76e0',
    fontWeight: '900',
    textAlign: 'center',
  },

  btn_alert_yes: {
    backgroundColor: '#39b364',
    width: '25%',
    height: 40,
    borderRadius: 6,
    marginHorizontal: 10,
    marginTop: 10,
  },
  btn_alert_yesText: {
    color: '#fff',
    fontWeight: '900',
    textAlign: 'center',
  },
  btn_alert_no: {
    backgroundColor: '#99e6b5',
    width: '25%',
    height: 40,
    borderRadius: 6,
    marginHorizontal: 10,
    marginTop: 10,
  },
  btn_alert_noText: {
    color: '#39b364',
    fontWeight: '900',
    textAlign: 'center',
  },
  fieldSet: {
    margin: 10,
    paddingHorizontal: 10,
    paddingVertical: 20,
    paddingBottom: 10,
    borderRadius: 5,
    alignItems: 'center',
    borderStyle: 'dashed',
    borderColor: '#2474c2',
    borderWidth: 1,
  },
  legend: {
    position: 'absolute',
    top: -16,
    left: 10,
    fontWeight: 'bold',
    backgroundColor: 'white',
    fontSize: 22,
    color: '#2474c2',
    fontFamily: 'AbadiMTStd',
  },
  borderSolid: {
    borderStyle: 'solid',
  },
  borderDashed: {
    borderStyle: 'dashed',
  },
  borderDotted: {
    borderStyle: 'dotted',
  },
  border_NoHorizontal: {
    borderRightWidth: 0,
    borderLeftWidth: 0,
  },
  border_NoVertical: {
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  card: {
    borderRadius: 6,
    width: 380,
    margin: 10,
    backgroundColor: 'white',
    padding: 5,
  },
  card_title: {
    fontSize: 20,
    lineHeight: 26,
    padding: 20,
    paddingBottom: 0,
    textAlign: 'left',
    fontFamily: 'AbadiMTStd',
  },
  card_text: {
    fontSize: 15,
    lineHeight: 26,
    padding: 20,
    paddingBottom: 0,
    textAlign: 'left',
    fontFamily: 'AbadiMTStd',
  },
  progressBar: {
    margin: 10,
    height: 9,
    width: '100%',
  },
  progressCircle: {
    marginHorizontal: 20,
  },
  nk_toolbar: {
    paddingVertical: 0,
    width: '100%',
    borderBottomWidth: 1.5,
    borderBottomColor: '#e8edf3',
    backgroundColor: 'white',
  },
  border_purple: {
    borderColor: Colors.border_accent_purple,
  },
  border_darkorange: {
    borderColor: Colors.border_dark_orange,
  },
  border_darkblue: {
    borderColor: Colors.border_dark_blue,
  },
  headerIcon: {
    width: 20,
    height: 20,
  },
  headertxtInput: {
    fontSize: 13,
    color: 'rgb(34, 34, 34)',
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 3,
    borderWidth: 0.6,
    borderColor: '#aaaaaa',
    fontFamily: 'AbadiMTStd',
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fieldsetTableIcon: {
    width: 20,
    height: 20,
  },
  alertIcon: {
    width: 90,
    height: 90,
  },
  alertIcon2: {
    width: 70,
    height: 70,
  },
  errorIcon: {
    width: 90,
    height: 90,
  },
  successIcon: {
    width: 90,
    height: 90,
  },
});
