import React, { memo, useContext, useState } from "react";
import Slider from "react-slick";
import cancelBtnIcon from "./../assets/images/cross-icon.svg";
import addMoreIcon from "../assets/images/add-more.svg";
import { LMFeedCreatePostContext } from "../contexts/LMFeedCreatePostContext";
import { LMFeedCreatePostMediaUploadMode } from "../shared/enums/lmCreatePostMediaHandlingMode";
import { Attachment } from "../shared/types/models/attachment";
import { Document, Page } from "react-pdf";
import pdfIcon from "../assets/images/pdf-icon.svg";
import { formatFileSize } from "../shared/utils";
import { OgTag } from "../shared/types/models/ogTag";
import { AttachmentType } from "@likeminds.community/feed-js";
interface LMFeedCreatePostDMediaPost {
  mediaUploadDialog?: string;
}
// eslint-disable-next-line no-empty-pattern
const LMQNAFeedCreateMediaPost = memo(({}: LMFeedCreatePostDMediaPost) => {
  const {
    mediaList,
    addMediaItem,
    removeMedia,
    mediaUploadMode,
    temporaryPost,
  } = useContext(LMFeedCreatePostContext);
  const [activeSlide, setActiveSlide] = useState<number>(0);
  // Configure settings for react-slick carousel
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  function renderMediaItems() {
    if (temporaryPost) {
      const attachmentsArray = temporaryPost.attachments;

      switch (attachmentsArray.length) {
        case 0:
          return null;
        case 1: {
          const attachment = attachmentsArray[0];
          switch (attachment.type) {
            case AttachmentType.DOCUMENT:
              return <DocumentMediaItem attachment={attachment} />;
            case AttachmentType.IMAGE:
              return <ImageMediaItem attachment={attachment} />;
            case AttachmentType.VIDEO:
              return <VideoMediaItem attachment={attachment} />;
            case AttachmentType.REEL:
              return <ReelMediaItem attachment={attachment} />;
            // case 4:
            //   return (
            //     <OGTagMediaItem ogTags={attachment.attachmentMeta.ogTags} />
            //   );

            default:
              return null;
          }
        }
        default: {
          return (
            <Slider
              {...settings}
              beforeChange={(_, nextSlide) => {
                setActiveSlide(nextSlide);
              }}
            >
              {attachmentsArray?.map((attachment) => {
                switch (attachment.type) {
                  case AttachmentType.DOCUMENT:
                    return <DocumentMediaItem attachment={attachment} />;
                  case AttachmentType.IMAGE:
                    return <ImageMediaItem attachment={attachment} />;
                  case AttachmentType.VIDEO:
                    return <VideoMediaItem attachment={attachment} />;
                  // case 4:
                  //   return <OGTagMediaItem attachment={attachment} />;
                  default:
                    return null;
                }
              })}
            </Slider>
          );
        }
      }
    } else {
      switch (mediaList?.length) {
        case 0:
          return null;

        case 1: {
          const file = mediaList[0];

          switch (file.type) {
            case "application/pdf": {
              return <DocumentMediaItem file={file} />;
            }
            case "video/mp4": {
              return <VideoMediaItem file={file} />;
            }
            case "image/jpeg":
            case "image/png":
            case "image/jpg":
              return <ImageMediaItem file={file} />;

            default:
              return null;
          }
        }

        default: {
          let isReelAttachmentsWithThumbnail = false;
          if (mediaList?.length === 2) {
            const hasReelInIt = mediaList.some(
              (attachment) => attachment.type === "video/mp4",
            );
            const hasThumbnail = mediaList.some((attachment) =>
              ["image/jpeg", "image/png", "image/jpg"].includes(
                attachment.type,
              ),
            );
            if (
              mediaUploadMode === LMFeedCreatePostMediaUploadMode.REEL &&
              hasReelInIt &&
              hasThumbnail
            ) {
              isReelAttachmentsWithThumbnail = true;
            }
          }
          if (isReelAttachmentsWithThumbnail) {
            const videoFile = mediaList?.find(
              (file) => file.type === "video/mp4",
            );
            const thumbnailFile = mediaList?.find((file) =>
              ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
            );
            return (
              <VideoMediaItem
                file={videoFile}
                showVideoPoster={true}
                posterImageFile={thumbnailFile}
              />
            );
          }
          return (
            <Slider
              {...settings}
              beforeChange={(_, nextSlide) => {
                setActiveSlide(nextSlide);
              }}
            >
              {mediaList?.map((mediaItem) => {
                switch (mediaItem.type) {
                  case "application/pdf": {
                    return <DocumentMediaItem file={mediaItem} />;
                  }
                  case "image/jpeg":
                  case "image/png":
                  case "image/jpg": {
                    return <ImageMediaItem file={mediaItem} />;
                  }

                  case "video/mp4": {
                    return <VideoMediaItem file={mediaItem} />;
                  }
                }
              })}
            </Slider>
          );
        }
      }
    }
  }

  if (!temporaryPost && !mediaList?.length) {
    return null;
  }
  return (
    <div className="postImgSlider">
      {!temporaryPost &&
        mediaUploadMode !== LMFeedCreatePostMediaUploadMode.REEL && (
          <div className="postImgSlider__header">
            <label className="postImgSlider__header--addMore">
              <img src={addMoreIcon} alt="icon" /> Add More
              <input
                lm-feed-component-id={`lm-feed-create-media-vwxyz`}
                onChange={addMediaItem}
                type="file"
                accept={
                  mediaUploadMode === LMFeedCreatePostMediaUploadMode.DOCUMENT
                    ? "application/pdf"
                    : "image/png, image/jpeg, image/jpg, video/mp4"
                }
              />
            </label>
            <div className="postImgSlider__header--cancelBtn">
              <img
                src={cancelBtnIcon}
                alt="video"
                onClick={() => {
                  if (removeMedia) {
                    removeMedia(activeSlide || 0);
                  }
                }}
                lm-feed-component-id={`lm-feed-create-media-fghij`}
              />
            </div>
          </div>
        )}
      {renderMediaItems()}
    </div>
  );
});
interface MediaItemProps {
  file?: File;
  attachment?: Attachment;
  ogTags?: OgTag;
  showVideoPoster?: boolean;
  posterImageFile?: File;
}
const ImageMediaItem = ({ file, attachment }: MediaItemProps) => {
  if (file) {
    return (
      <img
        className="lm-feed-create-post-media-item"
        lm-feed-component-id={`lm-feed-create-media-vwxyz-${file.name}`}
        src={URL.createObjectURL(file)}
        alt="image"
      />
    );
  } else if (attachment) {
    return (
      <img
        className="lm-feed-create-post-media-item"
        lm-feed-component-id={`lm-feed-edit-media-vwxyz-${attachment.metaData.url}`}
        src={attachment.metaData.url}
        alt="image"
      />
    );
  } else return null;
};
export const VideoMediaItem = memo(
  ({ file, attachment, showVideoPoster, posterImageFile }: MediaItemProps) => {
    if (file) {
      return (
        <video
          className="lm-feed-create-post-media-item"
          src={URL.createObjectURL(file)}
          // poster={attachment?.attachmentMeta.url}
          // poster="https://rukminim2.flixcart.com/image/850/1000/xif0q/poster/i/z/e/medium-poster-for-room-and-office-motivational-poster-for-walls-original-imagy55xzyag8sp3.jpeg?q=90&crop=false"
          controls
          lm-feed-component-id={`lm-feed-create-media-fghij-${file.name}`}
          poster={
            showVideoPoster && posterImageFile
              ? URL.createObjectURL(posterImageFile)
              : undefined
          }
        />
      );
    } else if (attachment) {
      return (
        <video
          className="lm-feed-create-post-media-item"
          src={attachment.metaData.url}
          controls
          lm-feed-component-id={`lm-feed-edit-media-fghij-${attachment.metaData.url}`}
        />
      );
    } else return null;
  },
);

const ReelMediaItem = ({ file, attachment }: MediaItemProps) => {
  if (file) {
    return (
      <video
        className="lm-feed-create-post-media-item"
        src={URL.createObjectURL(file)}
        controls
        lm-feed-component-id={`lm-feed-create-media-fghij-${file.name}`}
      />
    );
  } else if (attachment) {
    return (
      <video
        className="lm-feed-create-post-media-item"
        src={attachment.metaData.url}
        controls
        lm-feed-component-id={`lm-feed-edit-media-fghij-${attachment.metaData.url}`}
      />
    );
  } else return null;
};

const DocumentMediaItem = ({ attachment, file }: MediaItemProps) => {
  if (attachment) {
    const { metaData } = attachment;
    const { name, url, size } = metaData;
    return (
      <div
        className="attachmentPdf"
        lm-feed-component-id={`lm-feed-edit-media-klmno-${attachment.metaData.url}`}
      >
        <Document file={metaData?.url}>
          <Page
            pageNumber={1}
            className={"pdfPage"}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            // height={200}
          />
        </Document>

        <div className="attachmentPdf__content">
          <img
            src={pdfIcon}
            alt="pdf"
            className="attachmentOGTag__content--icon"
          />
          <div>
            <a
              className="attachmentPdf__content--title"
              target="_blank"
              href={url}
            >
              {name}
            </a>
            <div className="attachmentPdf__content--url">
              {formatFileSize(size || 0)}
            </div>
          </div>
        </div>
      </div>
    );
  } else if (file) {
    return (
      <div
        className="attachmentPdf"
        lm-feed-component-id={`lm-feed-create-media-klmno-${file.name}`}
      >
        <Document file={URL.createObjectURL(file)}>
          <Page
            pageNumber={1}
            className={"pdfPage"}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            // height={324}
          />
        </Document>

        <div className="attachmentPdf__content">
          <img
            src={pdfIcon}
            alt="pdf"
            className="attachmentOGTag__content--icon"
          />
          <div>
            <a
              className="attachmentPdf__content--title"
              target="_blank"
              // href={url}
            >
              {file.name}
            </a>
            <div className="attachmentPdf__content--url">
              {formatFileSize(file.size)}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default LMQNAFeedCreateMediaPost;
