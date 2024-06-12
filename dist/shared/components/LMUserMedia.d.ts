/// <reference types="react" />
import { AvatarProps } from "../types/models/avatarProps";
declare const getInitials: (name: string) => string;
declare const handleImageError: (event: React.SyntheticEvent<HTMLImageElement>) => void;
declare const getAvatar: ({ imageUrl, name, onError }: AvatarProps) => JSX.Element;
export { getInitials, handleImageError, getAvatar };
