export interface INmInitGetUserDetails {
  status: boolean;
  data: any;
}

export interface AssetResult {
  value?: boolean;
  versionCheck?: number;
  title?: string;
  message?: string;
}

export interface ConfigItem {
  code: string;
  value: any;
  [key: string]: any; // Allows for other dynamic properties
}
