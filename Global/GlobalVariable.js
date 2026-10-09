import {NmGetDate} from '../functions/NmFunctions';

// Global Variables that are technically not in use. DO NOT REMVOE FOR NOW
global.ApprovalItems = [];
global.DatabaseTables = [];
global.dbark;
global.dbnoah;
global.AppDatabaseInitialized = false;

//================= SHOP VARIABLES =================//

export const SampleTopDoctorsList = [
  {
    id: 1001,
    name: 'Dr. House',
    photo: require('../assets/Images/Hospital/dr_3.png'),
    specialty: 'General Medicine',
    specialtyCode: 'GENMED',
  },
  {
    id: 1002,
    name: 'Dr. Phil',
    photo: require('../assets/Images/Hospital/dr_1.png'),
    specialty: 'Psychiatrist',
    specialtyCode: 'PEDXIN',
  },
  {
    id: 1003,
    name: 'Dr. Stephen Strange',
    photo: require('../assets/Images/Hospital/dr_2.jpg'),
    specialty: 'Neurologist',
    specialtyCode: 'NEUROL',
  },
  {
    id: 1004,
    name: 'Dr. John Carter',
    photo: require('../assets/Images/Hospital/dr_4.png'),
    specialty: 'Psychiatrist',
    specialtyCode: 'PSYCHI',
  },
];

export const NoDoctorData = {
  id: 'NO_DOCTORS',
  name: 'No Doctor Available',
  photo: require('../assets/Images/NoImage.jpg'),
  specialty: '',
  specialtyCode: '',
};

export const SampleRecentItems = [
  {
    tranType: 'Received Money from',
    tranMerchant: 'Bill Gates',
    tranAmount: '5000',
    tranDate: '2024-01-10',
    trantTime: '11:30 AM',
    tranIcon: require('../assets/Images/Payment/user_icon.png'),
  },
  {
    tranType: 'Purchased from',
    tranMerchant: 'Netflix.com',
    tranAmount: '549',
    tranDate: '2024-01-13',
    trantTime: '08:30 AM',
    tranIcon: require('../assets/Images/Payment/netflix_icon.png'),
  },
  {
    tranType: 'Sent Money via',
    tranMerchant: 'Bank Transfer',
    tranAmount: '200',
    tranDate: '2024-04-18',
    trantTime: '11:00 PM',
    tranIcon: require('../assets/Images/Payment/gcash_icon.png'),
  },
  {
    tranType: 'Bill Payment for',
    tranMerchant: 'Meralco',
    tranAmount: '1503.50',
    tranDate: '2024-03-20',
    trantTime: '03:30 PM',
    tranIcon: require('../assets/Images/Payment/meralco_icon.png'),
  },
  {
    tranType: 'Sent Money via',
    tranMerchant: 'Bank Transfer',
    tranAmount: '5000',
    tranDate: '2024-07-20',
    trantTime: '01:30 PM',
    tranIcon: require('../assets/Images/Payment/psbank_icon.png'),
  },
  //=========================
  {
    tranType: 'Received Money from',
    tranMerchant: 'Mark Zuckerberg',
    tranAmount: '15000',
    tranDate: '2024-10-10',
    trantTime: '11:30 AM',
    tranIcon: require('../assets/Images/Payment/user_icon.png'),
  },
  {
    tranType: 'Purchased from',
    tranMerchant: 'Netflix.com',
    tranAmount: '549',
    tranDate: '2024-02-13',
    trantTime: '08:30 AM',
    tranIcon: require('../assets/Images/Payment/netflix_icon.png'),
  },
  {
    tranType: 'Sent Money via',
    tranMerchant: 'Bank Transfer',
    tranAmount: '2200',
    tranDate: '2024-04-18',
    trantTime: '11:00 PM',
    tranIcon: require('../assets/Images/Payment/gcash_icon.png'),
  },
  {
    tranType: 'Bill Payment for',
    tranMerchant: 'Meralco',
    tranAmount: '3503.50',
    tranDate: '2024-03-20',
    trantTime: '03:30 PM',
    tranIcon: require('../assets/Images/Payment/meralco_icon.png'),
  },
  {
    tranType: 'Sent Money via',
    tranMerchant: 'Bank Transfer',
    tranAmount: '50000',
    tranDate: '2024-07-20',
    trantTime: '01:30 PM',
    tranIcon: require('../assets/Images/Payment/psbank_icon.png'),
  },
];

export const SampleWorkers = [
  {
    id: 2001,
    name: 'Ralph Itwreck',
    photo: require('../assets/Images/Handyman/hm_1.jpg'),
    specialty: 'Home Repair',
    specialtyCode: 'HMNHRP',
  },
  {
    id: 2002,
    name: 'Max Johnson',
    photo: require('../assets/Images/Handyman/hm_2.jpg'),
    specialty: 'Electrician',
    specialtyCode: 'HMNECE',
  },
  {
    id: 2003,
    name: 'Cornelius George',
    photo: require('../assets/Images/Handyman/hm_3.jpg'),
    specialty: 'Painter',
    specialtyCode: 'HMNPNT',
  },
  {
    id: 2004,
    name: 'Nick Adams',
    photo: require('../assets/Images/Handyman/hm_4.jpg'),
    specialty: 'Roofing',
    specialtyCode: 'HMNRUF',
  },
  {
    id: 2005,
    name: 'Jake Barnes',
    photo: require('../assets/Images/Handyman/hm_5.jpg'),
    specialty: 'Carpenter',
    specialtyCode: 'HMNCRP',
  },
  {
    id: 2006,
    name: 'Tony Wayne',
    photo: require('../assets/Images/Handyman/hm_4.jpg'),
    specialty: 'Carpenter',
    specialtyCode: 'HMNCRP',
  },
];

export const NoHandymanData = {
  id: 'NO_Handyman',
  name: 'No Handyman Available',
  photo: require('../assets/Images/NoImage.jpg'),
  specialty: '',
  specialtyCode: '',
};

export const SampleGridItems = [
  {
    itemId: 'A01',
    itemName: 'NOAH Business Applications',
    itemBrand: 'Facebook',
    itemPrice: 'Free',
    backgroundImage: [{backgroundImage: require('../assets/Images/gallery_1.jpg')}],
    screen: '',
    app: 'fb://page/417091228862053',
    appName: 'Facebook',
  },
  {
    itemId: 'A02',
    itemName: 'Start private message',
    itemBrand: 'Viber',
    itemPrice: 'Free',
    backgroundImage: [{backgroundImage: require('../assets/Images/gallery_2.jpg')}],
    screen: '',
    app: 'viber://chat?number=639177105951',
    appName: 'Viber',
  },
  {
    itemId: 'A03',
    itemName: 'Show NOAH on Maps',
    itemBrand: 'Google Maps',
    itemPrice: 'Free',
    backgroundImage: [{backgroundImage: require('../assets/Images/gallery_3.jpg')}],
    screen: '',
    app: 'https://www.google.com/maps/place/NOAH+Business+Applications/@14.5623734,121.0225583,17z/data=!3m1!4b1!4m6!3m5!1s0x3397c90779055555:0x16c2065c46e315!8m2!3d14.5623734!4d121.0251332!16s%2Fg%2F11hzzx3v0g?entry=ttu',
    appName: '',
  },
  {
    itemId: 'A04',
    itemBrand: 'Nokia',
    itemName: '6220 Classic',
    itemDescription:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book",
    itemPrice: '$200.23',
    backgroundImage: [
      {backgroundImage: require('../assets/Images/Item_Phone/01.jpg')},
      {backgroundImage: require('../assets/Images/Item_Phone/02.jpg')},
      {backgroundImage: require('../assets/Images/Item_Phone/03.jpg')},
      {backgroundImage: require('../assets/Images/Item_Phone/04.jpg')},
      {backgroundImage: require('../assets/Images/Item_Phone/05.jpg')},
      {backgroundImage: require('../assets/Images/Item_Phone/06.jpg')},
      {backgroundImage: require('../assets/Images/Item_Phone/07.jpg')},
      {backgroundImage: require('../assets/Images/Item_Phone/08.jpg')},
      {backgroundImage: require('../assets/Images/Item_Phone/09.jpg')},
      {backgroundImage: require('../assets/Images/Item_Phone/10.jpg')},
    ],
    screen: '',
    app: '',
    appName: '',
  },
  {
    itemId: 'A05',
    itemName: 'Sony A9 R',
    itemBrand: 'Sony',
    itemDescription: '',
    itemPrice: '$895.50',
    backgroundImage: [{backgroundImage: require('../assets/Images/Item_Camera/01.jpg')}],
    screen: '',
    app: '',
    appName: '',
  },
  {
    itemId: 'A06',
    itemName: 'Awesome Printed Shirt',
    itemBrand: 'PlainWhiteTees',
    itemDescription: 'Just a plain white T-Shirt with some design',
    backgroundImage: [
      {backgroundImage: require('../assets/Images/Item_Shirt/01.jpg')},
      {backgroundImage: require('../assets/Images/Item_Shirt/02.png')},
      {backgroundImage: require('../assets/Images/Item_Shirt/03.jpg')},
    ],
    itemPrice: '$19.99',
    screen: '',
    app: '',
    appName: '',
  },
  {
    itemId: 'A07',
    itemName: 'Navigation Example',
    itemBrand: 'Maps',
    backgroundImage: [{backgroundImage: require('../assets/Images/gallery_7.jpg')}],
    screen: '',
    app: 'https://www.google.com/maps/dir/?api=1&destination=Pasig+Rainforest+Park+Pasig+Metro+Manila',
    appName: '',
  },
  {
    itemId: 'A08',
    itemName: 'Messenger Example',
    itemBrand: 'Facebook',
    backgroundImage: [{backgroundImage: require('../assets/Images/gallery_8.jpg')}],
    screen: '',
    app: 'http://m.me/NOAHBusinessApplications',
    appName: '',
  },
  {
    itemId: 'A09',
    itemName: 'Interior remodeling',
    itemBrand: 'ABC Services',
    backgroundImage: [{backgroundImage: require('../assets/Images/gallery_9.jpg')}],
    screen: '',
    app: '',
    appName: '',
  },
  {
    itemId: 'A10',
    itemName: 'Real estate agent 47',
    itemBrand: 'Dream Landscape',
    backgroundImage: [{backgroundImage: require('../assets/Images/gallery_10.jpg')}],
    screen: '',
    app: '',
    appName: '',
  },
  {
    itemId: 'A11',
    itemName: '',
    itemBrand: '',
    backgroundImage: [{backgroundImage: require('../assets/Images/gallery_11.jpg')}],
    screen: '',
    app: '',
    appName: '',
  },
  // {
  //   itemId: 'A12',
  //   itemName: '',
  //   itemBrand: '',
  //   backgroundImage: [{backgroundImage: require('../assets/Images/gallery_12.jpg')}],
  //   screen: '',
  //   app: '',
  //   appName: '',
  // },
];

export const SamplePublicParkingList = [
  {
    placeName: 'Dock Mall',
    placeAddress: '209 Nicanor Garcia Street, Bel-Air II, Makati City',
    placeImage: require('../assets/Images/Parking/mall_1.jpg'),
    placeParkingStatus: 1,
  },
  {
    placeName: 'Peak Plaza',
    placeAddress: '8003 Alabang-Zapote Road, Las Pinas',
    placeImage: require('../assets/Images/Parking/mall_2.jpg'),
    placeParkingStatus: 1,
  },
  {
    placeName: 'RetailPerk',
    placeAddress: '88 11th Corner Atlanta Streets, Manila',
    placeImage: require('../assets/Images/Parking/mall_3.jpg'),
    placeParkingStatus: 0,
  },
  {
    placeName: 'Retilan',
    placeAddress: 'N. Aquino Avenue, Paranaque City',
    placeImage: require('../assets/Images/Parking/mall_4.jpg'),
    placeParkingStatus: 1,
  },
];

export const carColors = [
  require('../assets/Images/Parking/car01.png'),
  require('../assets/Images/Parking/car02.png'),
  require('../assets/Images/Parking/car03.png'),
  require('../assets/Images/Parking/car04.png'),
  require('../assets/Images/Parking/car05.png'),
  require('../assets/Images/Parking/car06.png'),
  require('../assets/Images/Parking/car07.png'),
];

const parkingSectionLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

export const SampleGroupLayout = numSlots => {
  let parkingSlots = [];
  for (let x = 1; x <= numSlots; x++) {
    parkingSlots.push({parkId: ''});
  }
  return parkingSlots;
};

export const SampleSlotGroups = numSlots => {
  let parkingSlots = [];
  for (let x = 0; x < numSlots; x++) {
    let tmpNumSlot = numSlots + '';
    tmpNumSlot = tmpNumSlot.length < 2 ? '0' + tmpNumSlot : tmpNumSlot;

    parkingSlots.push(parkingSectionLetters[x].concat('01-').concat(tmpNumSlot));
  }
  return parkingSlots;
};

export const LoremText =
  "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum";

export const SampleFoodItems = [
  {
    itemId: 'JLB_1PCCHKJY',
    itemName: '1pc Chicken Joy',
    itemSeller: 'Jollibee',
    itemCategory: 'CAT_FULLML',
    itemImage: require('../assets/Images/Food/item_1.png'),
    itemPrice: 79.99,
    rating: '5.0',
  },
  {
    itemId: 'JLB_YUMBRG',
    itemName: 'Yumburger',
    itemSeller: 'Jollibee',
    itemCategory: 'CAT_BURGRS',
    itemImage: require('../assets/Images/Food/yumburger.png'),
    itemPrice: 40.5,
    rating: '5.0',
  },
  {
    itemId: 'JLB_CHMPB',
    itemName: 'Champ',
    itemSeller: 'Jollibee',
    itemCategory: 'CAT_BURGRS',
    itemImage: require('../assets/Images/Food/champ.png'),
    itemPrice: 240.0,
    rating: '5.0',
  },
  {
    itemId: 'PTC_TRMIX',
    itemName: 'Tera Mix',
    itemSeller: 'Potato Corner',
    itemCategory: 'CAT_SNACKS',
    itemImage: require('../assets/Images/Food/item_2.png'),
    itemPrice: 50.0,
    rating: '4.5',
  },
  {
    itemId: 'PTC_JMBFRY',
    itemName: 'Jumbo Fries',
    itemSeller: 'Potato Corner',
    itemCategory: 'CAT_SNACKS',
    itemImage: require('../assets/Images/Food/jumbofry.png'),
    itemPrice: 50.0,
    rating: '4.5',
  },
  {
    itemId: 'PTC_GGAFRY',
    itemName: 'Giga Fries',
    itemSeller: 'Potato Corner',
    itemCategory: 'CAT_SNACKS',
    itemImage: require('../assets/Images/Food/gigafry.jpg'),
    itemPrice: 50.0,
    rating: '4.5',
  },
  {
    itemId: 'APZ_SPNDPPIZ',
    itemName: 'Spinach Dip Pizza',
    itemSeller: "Angel's Pizza",
    itemCategory: 'CAT_PIZZAS',
    itemImage: require('../assets/Images/Food/item_3.jpg'),
    itemPrice: 395.0,
    rating: '4.9',
  },
  {
    itemId: 'APZ_MKZ2UMU',
    itemName: 'Mekus Mekus Ultimate Mash up',
    itemSeller: "Angel's Pizza",
    itemCategory: 'CAT_PIZZAS',
    itemImage: require('../assets/Images/Food/mekus2.jpg'),
    itemPrice: 799.0,
    rating: '4.9',
  },
  {
    itemId: 'APZ_ANGSUPRM',
    itemName: "Angel's Supreme",
    itemSeller: "Angel's Pizza",
    itemCategory: 'CAT_PIZZAS',
    itemImage: require('../assets/Images/Food/angelsupreme.jpg'),
    itemPrice: 380.0,
    rating: '4.9',
  },
  {
    itemId: 'MLKT_STRWRVM',
    itemName: 'Strawberry Red Velvet Milk Tea',
    itemSeller: 'Milk Tealicious',
    itemCategory: 'CAT_BEVRGS',
    itemImage: require('../assets/Images/Food/item_4.jpg'),
    itemPrice: 30.0,
    rating: '4.0',
  },
  {
    itemId: 'TBS_SML330',
    itemName: 'San Mig Light in Can 330ml',
    itemSeller: 'The Booze Shop',
    itemCategory: 'CAT_BEVRGS',
    itemImage: require('../assets/Images/Food/item_5.png'),
    itemPrice: 46.0,
    rating: '5.0',
  },
  {
    itemId: 'TBS_BUDB330',
    itemName: 'Budweiser Beer 330ml Bottle',
    itemSeller: 'The Booze Shop',
    itemCategory: 'CAT_BEVRGS',
    itemImage: require('../assets/Images/Food/bud330.png'),
    itemPrice: 120.0,
    rating: '5.0',
  },
  {
    itemId: 'TBS_BLMONB330',
    itemName: 'Blue Moon Belgian White 330ml',
    itemSeller: 'The Booze Shop',
    itemCategory: 'CAT_BEVRGS',
    itemImage: require('../assets/Images/Food/blbelgian.png'),
    itemPrice: 129.0,
    rating: '5.0',
  },
];

export const sampleAgendas = [
  {
    date: NmGetDate(undefined, 'dashYMD', undefined, -5),
    agendaList: [
      {
        time: '10:00 am',
        duration: '1 hr',
        agenda: 'Project updates and discussion',
      },
      {
        time: '03:00 pm',
        duration: '2 hrs',
        agenda: 'Management Meeting',
      },
    ],
  },
  {
    date: NmGetDate(undefined, 'dashYMD', undefined, -2),
    agendaList: [
      {
        time: '10:00 am',
        duration: '2 hrs',
        agenda: 'System discussion',
      },
    ],
  },
  {
    date: NmGetDate(undefined, 'dashYMD', undefined, 2),
    agendaList: [
      {
        time: '10:00 am',
        duration: '2 hrs',
        agenda: 'System discussion',
      },
    ],
  },
  {
    date: NmGetDate(undefined, 'dashYMD', undefined, 5),
    agendaList: [
      {
        time: '10:00 am',
        duration: '1 hr',
        agenda: 'Project updates and discussion',
      },
      {
        time: '03:00 pm',
        duration: '2 hrs',
        agenda: 'Management Meeting',
      },
      {
        time: '03:00 pm',
        duration: '2 hrs',
        agenda: 'Management Meeting',
      },
      {
        time: '03:00 pm',
        duration: '2 hrs',
        agenda: 'Management Meeting',
      },
      {
        time: '03:00 pm',
        duration: '2 hrs',
        agenda: 'Management Meeting',
      },
      {
        time: '03:00 pm',
        duration: '2 hrs',
        agenda: 'Management Meeting',
      },
      {
        time: '03:00 pm',
        duration: '2 hrs',
        agenda: 'Management Meeting',
      },
    ],
  },
];

export const MessageList = [
  {
    userId: 1001,
    userName: 'John Cena',
    messages: [
      {
        date: '2024-10-20 10:30:00.000',
        from: 'USER_SENDER',
        message: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC',
      },
      {
        date: '2024-10-20 10:31:00.000',
        from: 'USER_SENDER',
        message: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour',
      },
      {
        date: '2024-10-21 09:20:11.000',
        from: 'USER_CURRENT',
        message: 'What is Lorem Ipsum?',
      },
      {
        date: '2024-10-21 09:25:11.000',
        from: 'USER_SENDER',
        message: 'Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable',
      },
    ],
  },
  {
    userId: 1002,
    userName: 'Mark Musk',
    messages: [
      {
        date: '2024-10-21 09:30:11.000',
        from: 'USER_SENDER',
        message: 'Marker Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC',
      },
      {
        date: '2024-10-21 09:33:11.000',
        from: 'USER_SENDER',
        message: 'Marker There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour',
      },
      {
        date: '2024-10-21 13:30:11.000',
        from: 'USER_CURRENT',
        message: 'What are you saying?',
      },
      {
        date: '2024-10-21 14:10:11.000',
        from: 'USER_SENDER',
        message: 'Last Marker Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable',
      },
      {
        date: '2024-10-21 14:30:11.000',
        from: 'USER_CURRENT',
        message: 'Marker What is Lorem Ipsum?',
      },
      {
        date: '2024-10-22 08:10:11.000',
        from: 'USER_SENDER',
        message: 'Marker Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC',
      },
      {
        date: '2024-10-22 08:11:11.000',
        from: 'USER_SENDER',
        message: 'Marker There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour',
      },
      {
        date: '2024-10-22 09:17:11.000',
        from: 'USER_CURRENT',
        message: 'What are you saying?',
      },
      {
        date: '2024-10-22 09:50:11.000',
        from: 'USER_SENDER',
        message: 'Last Marker Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable',
      },
      {
        date: '2024-10-22 11:55:11.000',
        from: 'USER_CURRENT',
        message: 'Marker What is Lorem Ipsum?',
      },
      {
        date: '2024-10-22 13:50:11.000',
        from: 'USER_SENDER',
        message: 'Marker Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC',
      },
      {
        date: '2024-10-22 13:56:11.000',
        from: 'USER_SENDER',
        message: 'Marker There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour',
      },
      {
        date: '2024-10-22 14:50:11.000',
        from: 'USER_CURRENT',
        message: 'What are you saying?',
      },
      {
        date: '2024-10-22 15:20:11.000',
        from: 'USER_SENDER',
        message: 'Last Marker Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable',
      },
      {
        date: '2024-10-22 09:10:11.000',
        from: 'USER_CURRENT',
        message: 'Marker What is Lorem Ipsum?',
      },
    ],
  },
];

export const LookUpListOne = [
  {
    code: 'CODE001',
    description: 'Sample Description 001 With long text',
  },
  {
    code: 'CODE002',
    description: 'Sample Description 002',
  },
  {
    code: 'CODE003',
    description: 'Sample Description 003 with long text two',
  },
  // {
  //   code: 'CODE004',
  //   description: 'Sample Description 004',
  // },
  // {
  //   code: 'CODE005',
  //   description: 'Sample Description 005',
  // },
];

export const LookUpListTwo = [
  {
    code: 'CODE_ONLY001',
    description: 'Hidden Description 001',
  },
  {
    code: 'CODE_ONLY002',
    description: 'Hidden Description 002',
  },
  {
    code: 'CODE_ONLY003',
    description: 'Hidden Description 003',
  },
  {
    code: 'CODE_ONLY004',
    description: 'Hidden Description 004',
  },
  {
    code: 'CODE_ONLY005',
    description: 'Hidden Description 005',
  },
  {
    code: 'CODE_ONLY006',
    description: 'Hidden Description 006',
  },
  {
    code: 'CODE_ONLY007',
    description: 'Hidden Description 007',
  },
  {
    code: 'CODE_ONLY008',
    description: 'Hidden Description 008',
  },
  {
    code: 'CODE_ONLY009',
    description: 'Hidden Description 009',
  },
  {
    code: 'CODE_ONLY010',
    description: 'Hidden Description 010',
  },
  {
    code: 'CODE_ONLY011',
    description: 'Hidden Description 011',
  },
];

export const LookUpListThree = [
  {
    code: 'MULTIPLE_COLS_001',
    description: 'Description Only 001',
    'column Three': 'Extra Column 1',
    'column Four': 'More Column 1',
  },
  {
    code: 'MULTIPLE_COLS_002',
    description: 'Description Only 002',
    'column Three': 'Extra Column 2',
    'column Four': 'More Column 3',
  },
  {
    code: 'MULTIPLE_COLS_003',
    description: 'Description Only 003',
    'column Three': 'Extra Column 3',
    'column Four': 'More Column 3',
  },
  {
    code: 'MULTIPLE_COLS_004',
    description: 'Description Only 004',
    'column Three': 'Extra Column 4',
    'column Four': 'More Column 4',
  },
  {
    code: 'MULTIPLE_COLS_005',
    description: 'Description Only 005',
    'column Three': 'Extra Column 5',
    'column Four': 'More Column 5',
  },
];

global.TestResponse =
  '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';
