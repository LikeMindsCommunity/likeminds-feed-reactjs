export interface User {
  customTitle: string;
  id: number;
  imageUrl: string;
  isGuest: boolean;
  isOwner?: boolean;
  name: string;
  organisationName?: null;
  sdkClientInfo: SdkClientInfo;
  state?: number;
  updatedAt?: number;
  userUniqueId: string;
  uuid: string;
  isDeleted?: boolean;
}

export interface SdkClientInfo {
  community: number;
  user: number;
  userUniqueId: string;
  uuid: string;
  widgetId: string;
}
