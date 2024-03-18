import { AvatarProps } from "../types/models/avatarProps";

// Function to extract initials from a name
const getInitials = (name: string): string => {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("");
  return initials.toUpperCase();
};

// Function to handle broken or undefined image URLs
const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
  event.currentTarget.style.display = "none"; // Hide the broken image
};

const getAvatar = ({ imageUrl, name, onError }: AvatarProps): JSX.Element => {
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    if (onError) {
      onError();
    } else {
      event.currentTarget.style.display = "none";
    }
  };

  return imageUrl ? (
    <img src={imageUrl} onError={handleImageError} alt="avatar" />
  ) : (
    <div className="avatar-initials lm-flex-container lm-justify-content-center lm-align-items-center">
      {name ? getInitials(name) : ""}
    </div>
  );
};


export {getInitials, handleImageError, getAvatar}