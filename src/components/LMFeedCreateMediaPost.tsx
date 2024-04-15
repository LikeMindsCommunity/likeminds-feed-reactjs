import React, { useContext, useState } from "react";
import Slider from "react-slick";
import cancelBtnIcon from "./../assets/images/cross-icon.svg";
import addMoreIcon from "../assets/images/add-more.svg";
import { LMFeedCreatePostContext } from "../contexts/LMFeedCreatePostContext";
import { LMFeedCreatePostMediaUploadMode } from "../shared/enums/lmCreatePostMediaHandlingMode";

interface LMFeedCreatePostDMediaPost {
  mediaUploadDialog?: string;
}
// eslint-disable-next-line no-empty-pattern
const LMFeedCreateMediaPost = ({}: LMFeedCreatePostDMediaPost) => {
  const { mediaList, addMediaItem, removeMedia, mediaUploadMode } = useContext(
    LMFeedCreatePostContext,
  );
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
    switch (mediaList?.length) {
      case 0:
        return null;

      case 1: {
        const file = mediaList[0];

        switch (file.type) {
          case "application/pdf": {
            return null;
          }
          case "image/jpeg":
          case "image/png":
          case "image/jpg":
            return <ImageMediaItem file={file} />;
          case "video/mp4": {
            return <VideoMediaItem file={file} />;
          }
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
            {mediaList?.map((mediaItem) => {
              switch (mediaItem.type) {
                case "application/pdf": {
                  return null;
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
  if (!mediaList?.length) {
    return null;
  }
  return (
    <div>
      {/* Post Slider  */}
      <div className="postImgSlider">
        <div className="postImgSlider__header">
          <label className="postImgSlider__header--addMore">
            <img src={addMoreIcon} alt="icon" /> Add More
            <input
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
            />
          </div>
        </div>
        {renderMediaItems()}
      </div>
    </div>
  );
};
interface MediaItemProps {
  file: File;
}
const ImageMediaItem = ({ file }: MediaItemProps) => {
  return (
    <img
      className="lm-feed-create-post-media-item"
      src={URL.createObjectURL(file)}
      alt="image"
    />
  );
};
const VideoMediaItem = ({ file }: MediaItemProps) => {
  return (
    <video
      className="lm-feed-create-post-media-item"
      src={URL.createObjectURL(file)}
      controls
    />
  );
};

export default LMFeedCreateMediaPost;
