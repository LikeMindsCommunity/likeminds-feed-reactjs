import { User } from "../shared/types/models/member";
import { Community } from "../shared/types/models/community";
import { LMClient } from "../shared/types/dataLayerExportsTypes";
import { LMFeedCustomEvents } from "../shared/customEvents";
export interface UserDetails {
    accessToken?: string;
    refreshToken?: string;
    uuid?: string;
    username?: string;
    isGuest?: boolean;
    apiKey?: string;
}
interface UserProviderInterface {
    lmFeedUser: User | null;
    logoutUser: () => void;
    lmFeedUserCurrentCommunity: Community | null;
}
export default function useUserProvider(lmFeedclient: LMClient, customEventClient: LMFeedCustomEvents, userCreds: UserDetails): UserProviderInterface;
export {};
