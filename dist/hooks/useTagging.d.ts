import { TaggingMember } from "../shared/types/models/taggingMember";
type Tag = TaggingMember;
interface UseTagging {
    taggingList: Tag[];
    clearTaggingList: () => void;
    fetchTaggingList: (pg?: number) => void;
    setTaggingString: (str: string | null) => void;
    fetchMoreTags: boolean;
}
export declare function useTagging(): UseTagging;
export {};
