import { User } from "../types/models/member";
import { Community } from "../types/models/Community";
interface UserProviderInterface {
    lmFeedUser: User | null;
    logoutUser: () => void;
    lmFeedUserCurrentCommunity: Community | null;
}
export default function useUserProvider(uuid: string, isGuest: boolean, userId?: string): UserProviderInterface;
export {};
