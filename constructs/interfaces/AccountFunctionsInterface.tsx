export interface IRegProofData {
  name: string;
  uri: string;
  fileName: string;
  type: string;
}

export interface IUserDetails {
  LName: string;
  LEmail: string;
  LMobile: string;
}

export interface IRegFilePicker {
  uri: string;
  type: string;
  [key: string]: any;
}

export interface IRegUserDetails {
  accountProperty: string;
  accountCustomerType: string;
  accountNoInfo: string;
  accountNameInfo: string;
  accountEmailInfo: string;
  accountPhoneInfo: string;
}
