import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import { AvatarProps } from "./types/models/AvatarProps";
dayjs.extend(relativeTime);
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

const formatTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;

  // Calculate time difference in seconds
  const diffSeconds = Math.floor(diff / 1000);

  // Convert seconds to minutes
  const diffMinutes = Math.floor(diffSeconds / 60);

  // Convert minutes to hours
  const diffHours = Math.floor(diffMinutes / 60);

  // Convert hours to days
  const diffDays = Math.floor(diffHours / 24);

  // Convert days to months
  const diffMonths = Math.floor(diffDays / 30);

  // Convert months to years
  const diffYears = Math.floor(diffMonths / 12);

  if (diffYears > 0) {
    return `${diffYears} ${diffYears === 1 ? "year" : "years"} ago`;
  } else if (diffMonths > 0) {
    return `${diffMonths} ${diffMonths === 1 ? "month" : "months"} ago`;
  } else if (diffDays > 0) {
    return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
  } else {
    return `${diffMinutes} ${diffMinutes === 1 ? "minute" : "minutes"} ago`;
  }
};
// TODO remove the daysjs dependency and manually do it
const timeFromNow = (time: string) => dayjs(time).fromNow();

export { getInitials, handleImageError, getAvatar, formatTimeAgo, timeFromNow };
