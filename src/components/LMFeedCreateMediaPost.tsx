import React from "react";
import Slider from "react-slick";
import cancelBtnIcon from "./../assets/images/cross-icon.svg";
import addMoreIcon from "../assets/images/add-more.svg";

interface LMFeedCreatePostDMediaPost {
  mediaUploadDialog?: string;
}
// eslint-disable-next-line no-empty-pattern
const LMFeedCreateMediaPost = ({}: LMFeedCreatePostDMediaPost) => {
  // Configure settings for react-slick carousel
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="">
      {/* Post Slider  */}
      <div className="postImgSlider">
        <div className="postImgSlider__header">
          <button className="postImgSlider__header--addMore">
            <img src={addMoreIcon} alt="icon" /> Add More
          </button>
          <div className="postImgSlider__header--cancelBtn">
            <img src={cancelBtnIcon} alt="video" />
          </div>
        </div>
        {/* Single image */}
        {/* <img
          src="https://buffer.com/library/content/images/size/w1200/2023/10/free-images.jpg"
          alt="image"
        /> */}
        {/* Multi images */}
        <Slider {...settings}>
          <img
            src="https://buffer.com/library/content/images/size/w1200/2023/10/free-images.jpg"
            alt="image"
          />
          <img
            src="https://buffer.com/library/content/images/size/w1200/2023/10/free-images.jpg"
            alt="image"
          />
          <img
            src="https://buffer.com/library/content/images/size/w1200/2023/10/free-images.jpg"
            alt="image"
          />
        </Slider>
      </div>
      {/* Multi images */}
      {/* Post Slider  */}

      {/* Post Slider  */}
      <div className="postDocs">
        <div className="postDocs__header">
          <button className="postDocs__header--addMore">
            <img src={addMoreIcon} alt="icon" /> Add More
          </button>
          <div className="postDocs__header--cancelBtn">
            <img src={cancelBtnIcon} alt="video" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LMFeedCreateMediaPost;
