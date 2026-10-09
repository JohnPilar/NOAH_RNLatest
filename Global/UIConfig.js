export const UIConfig = {
  PoweredLogo: require('../assets/NOAH/poweredby_alpha_center_small.png'),
  BiometricIcon: require('../assets/Icons/icon_biometric.png'),
  QRCodeIcon: require('../assets/Icons/icon_qr_scan.png'),
  DropdownIcon: require('../assets/Icons/component_dropdown_arrow.png'),
  FAQIcon: require('../assets/DashboardIcons/FAQ.png'),

  RegPropertyIcon: require('../assets/Icons/icon_register.png'),
  RegOTPMobileIcon: require('../assets/Icons/icon_otp_mobile.png'),
  RegOTPEmailIcon: require('../assets/Icons/icon_otp_email.png'),
  RegSubmittedIcon: require('../assets/Icons/icon_submitted.png'),
  AccResetPassIcon: require('../assets/Icons/icon_reset_password.png'),
  AccNewPassIcon: require('../assets/Icons/icon_new_password.png'),
};

export const getDashboardIcon = name => {
  switch (name) {
    case 'DashProfile':
      return require('../assets/DashboardIcons/ProfileDetails.png');
    case 'DashNotices':
      return require('../assets/DashboardIcons/Notices.png');
    case 'DashReqTracker':
      return require('../assets/DashboardIcons/RequestTracker.png');
    case 'DashReqEntry':
      return require('../assets/DashboardIcons/RequestEntry.png');
    case 'DashPayment':
      return require('../assets/DashboardIcons/Payments.png');
    case 'DashBillings':
      return require('../assets/DashboardIcons/Billings.png');
    case 'DashOtherReqs':
      return require('../assets/DashboardIcons/OtherRequests.png');
    case 'DashFAQ':
      return require('../assets/DashboardIcons/FAQ.png');
    case 'DashPayNow':
      return require('../assets/DashboardIcons/PayNow.png');
    case 'DashArkQX':
      return require('../assets/DashboardIcons/ArkQX.png');
    case 'DashItem':
      return require('../assets/DrawerIcons/drawer-tacs.png');
    case 'DashUpload':
      return require('../assets/DrawerIcons/drawer-privacy.png');
    case 'DashMessage':
      return require('../assets/DrawerIcons/message-question-outline.png');
    case 'DashPerCompany':
      return require('../assets/DrawerIcons/receipt-text-send-outline.png');
    case 'DashPerProject':
      return require('../assets/DrawerIcons/receipt-text-send-outline.png');
    case 'DashScmsReq':
      return require('../assets/DrawerIcons/drawer-tacs.png');
    default:
      return require('../assets/DashboardIcons/OtherRequests.png');
  }
};
