const BASE_URL = '../asset/gallery/image/';

export const getImage = name => {
  switch (name) {
    case 'home-outline':
      return require('../DrawerIcons/home-outline.png');
    case 'bell-circle-outline':
      return require('../DrawerIcons/bell-circle-outline.png');
    case 'account-details-outline':
      return require('../DrawerIcons/account-details-outline.png');
    case 'hand-extended-outline':
      return require('../DrawerIcons/hand-extended-outline.png');
    case 'wallet-bifold-outline':
      return require('../DrawerIcons/wallet-bifold-outline.png');
    case 'receipt-text-send-outline':
      return require('../DrawerIcons/receipt-text-send-outline.png');
    case 'format-list-group-plus':
      return require('../DrawerIcons/format-list-group-plus.png');
    case 'bell-ring':
      return require('../DrawerIcons/bell-ring.png');
    case 'clipboard-text-clock-outline':
      return require('../DrawerIcons/clipboard-text-clock-outline.png');
    case 'newspaper-variant-outline':
      return require('../DrawerIcons/newspaper-variant-outline.png');
    case 'message-question-outline':
      return require('../DrawerIcons/message-question-outline.png');
    case 'drawer-privacy':
      return require('../DrawerIcons/drawer-privacy.png');
    case 'drawer-tacs':
      return require('../DrawerIcons/drawer-tacs.png');
    case 'submenu':
      return require('../DrawerIcons/format-list-group-plus.png');
    case 'DashProfile':
      return require('../DashboardIcons/ProfileDetails.png');
    case 'DashArkQX':
      return require('../DashboardIcons/ArkQX.png');
    case 'DashItem':
      return require('../DrawerIcons/receipt-text-send-outline.png');
    case 'DashUpload':
      return require('../DrawerIcons/drawer-privacy.png');
    case 'DashMessage':
      return require('../DrawerIcons/message-question-outline.png');
    case 'DashPerCompany':
      return require('../DrawerIcons/receipt-text-send-outline.png');
    case 'DashPerProject':
      return require('../DrawerIcons/receipt-text-send-outline.png');
    case 'DashScmsReq':
      return require('../DrawerIcons/drawer-tacs.png');
    default:
      return require('../DrawerIcons/format-list-group-plus.png');
  }
};
