import { Member } from "../models/member";
export interface GetAllMembersResponse {
    success: boolean;
    data: {
        members: Member[];
        membersCount: number;
        totalMembers: number;
    };
}
