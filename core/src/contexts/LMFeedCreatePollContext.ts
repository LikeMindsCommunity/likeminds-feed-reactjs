import { createContext } from "react";
import { ComponentDelegatorListener } from "../shared/types/cutomCallbacks/callbacks";

interface LMFeedCreatePollContextInterface {
  openCreatePollDialog?: boolean;
  setOpenCreatePollDialog?: React.Dispatch<boolean>;
  onAddPollOptionClicked? : ComponentDelegatorListener;
}
export const LMFeedCreatePollContext =
  createContext<LMFeedCreatePollContextInterface>(
    {} as LMFeedCreatePollContextInterface,
  );
