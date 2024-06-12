import { SdkClientInfo } from "./member";
export interface TaggingMember {
    custom_title: string | null;
    id: number;
    image_url: string;
    is_deleted: boolean;
    is_guest: boolean;
    name: string;
    question_answers: null;
    sdk_client_info: SdkClientInfo;
    user_unique_id: string;
    uuid: string;
}
