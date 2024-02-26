import React from "react";
import { Post } from "../types/models/post";
import { User } from "../types/models/member";
import { formatTimeAgo, getAvatar } from "../shared/utils";
import { parseAndReplaceTags } from "../shared/taggingParser";
// import Attachment from "../shared/components/Attachments";
import Carousel from "../shared/components/Carousel";
import { Video, Image } from "../shared/types";
import { Attachment } from "../types/models/attachment";

interface PostsProps {
  post: Post;
  user: User | undefined;
}

// Assuming you have a function to filter attachments into images and videos
const filterAttachments = (attachments: Attachment[]) => {
  const images: Image[] = [];
  const videos: Video[] = [];

  attachments.forEach((attachment) => {
    if (attachment.attachmentType === 1) {
      // Assuming attachmentType 1 represents images
      images.push({
        src: attachment.attachmentMeta.url,
        alt: attachment.attachmentMeta.name, // You can set alt to whatever is appropriate
      });
    } else if (attachment.attachmentType === 2) {
      // Assuming attachmentType 2 represents videos
      videos.push({
        src: attachment.attachmentMeta.url,
      });
    }
  });

  return { images, videos };
};

const Posts: React.FC<PostsProps> = (props) => {
  const { text, createdAt, isEdited, attachments } = props.post;
  const { name, imageUrl, customTitle } = props.user || {};

  const { images, videos } = filterAttachments(attachments);

  // Determine the avatar content based on imageUrl and name
  const avatarContent = getAvatar({ imageUrl, name });

  // // Render attachments
  // const renderAttachments = () => {
  //   if (!attachments || attachments.length === 0) {
  //     return null;
  //   }

  //   return (
  //     <div className="attachments">
  //       <Carousel images={attachments} />
  //       {/* <Carousel images={attachments} videos={videos} /> */}
  //       {/* <Attachment attachments={attachments} /> */}
  //       {/* {attachments.map((attachment, index) => (
  //         <Attachment key={index} attachment={attachment} />
  //       ))} */}
  //     </div>
  //   );
  // };

  return (
    <div className="lm-feed-wrapper__card lm-mb-2">
      <div className="lm-feed-wrapper__card__header">
        <div className="lm-flex-container">
          <div className="lm-avatar lm-mr-5">{avatarContent}</div>
          <div>
            <div className="lm-feed-wrapper__card__header--title">
              {name} {customTitle ? <span>{customTitle}</span> : null}
            </div>
            <div className="lm-feed-wrapper__card__header--text">
              Post
              <span>{formatTimeAgo(createdAt)}</span>
              {isEdited ? (
                <span className="lm-primary-text">Edited</span>
              ) : null}
            </div>
          </div>
        </div>
        <div>{/* right panel */}</div>
      </div>
      <div className="lm-feed-wrapper__card__body">
        <div className="lm-feed-wrapper__card__body__content">
          {parseAndReplaceTags(text)}
        </div>
        <div className="lm-feed-wrapper__card__body__attachment">
          {/* {renderAttachments()} */}
          <Carousel images={images} videos={videos} />
        </div>
      </div>
      <div className="lm-feed-wrapper__card__footer">
        {/* <h1>{footer}</h1> */}
      </div>
    </div>
  );
};

export default Posts;
