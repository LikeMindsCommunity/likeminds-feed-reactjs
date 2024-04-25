import { useContext } from "react";
import { truncateString } from "../shared/utils";
import { LMFeedCreatePostContext } from "../contexts/LMFeedCreatePostContext";
import closeIcon from "../assets/images/close-media-upload-icon.svg";
import brokenLink from "../assets/images/broken-link.svg";

export const LMFeedOGTagMediaItem = () => {
  const { ogTag, closeOGTagContainer, temporaryPost } = useContext(
    LMFeedCreatePostContext,
  );
  if (ogTag) {
    return (
      <div className="media-item-attachmentOGTag">
        {!temporaryPost && (
          <img
            src={closeIcon}
            className="og-tag-close-icon lm-cursor-pointer"
            alt="close-icon"
            onClick={(e) => {
              e.preventDefault();
              if (closeOGTagContainer) {
                closeOGTagContainer();
              }
            }}
          />
        )}
        {ogTag?.image ? (
          <img
            src={ogTag.image}
            alt="og tag image"
            className="media-item-attachmentOGTag__attachmentOGTag__img"
          />
        ) : (
          <div className="media-item-attachmentOGTag__attachmentOGTag__noImg">
            <img
              src={brokenLink}
              alt="broken-link"
              // className="media-item-attachmentOGTag__attachmentOGTag__img"
            />
            <span>{ogTag?.url}</span>
          </div>
        )}
        <div className="media-item-attachmentOGTag__attachmentOGTag__content">
          <a className="link-url" href={ogTag.url} target="_blank">
            {truncateString(ogTag?.title, 100)}
          </a>
          <div className="media-item-attachmentOGTag__attachmentOGTag__content--desc">
            {truncateString(ogTag?.description, 300)}
          </div>
          <div className="media-item-attachmentOGTag__attachmentOGTag__content--url">
            {ogTag?.url}
          </div>
        </div>
      </div>
    );
  }
};
