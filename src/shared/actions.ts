import { LMClient } from "../types/DataLayerExportsTypes";

interface PostLikeActionInterface {
  entityId: string;
  client: LMClient;
  context;
}
export const likeAction = async ({ en }: LikeActionInterface) => {};
