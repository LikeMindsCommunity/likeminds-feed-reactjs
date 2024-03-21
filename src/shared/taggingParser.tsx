import React, { ReactNode } from "react";

export const parseAndReplaceTags = (text: string): ReactNode => {
  if (!text) {
    return null; // Return null if text is empty
  }

  const tagRegex = /<<([^|]+)\|([^>]+)>>/g;
  const lines = text.split(/\r?\n/); // Split text into lines
  const elements: ReactNode[] = [];

  lines.forEach((line, lineIndex) => {
    if (lineIndex > 0) {
      // Add line break between lines
      elements.push(<br key={`br-${lineIndex}`} />);
    }

    let lastIndex = 0;

    line.replace(tagRegex, (match, name, route, index) => {
      // Add the text before the tag
      if (index > lastIndex) {
        elements.push(line.substring(lastIndex, index));
      }

      // Add the user info tag as a clickable span
      elements.push(
        <span
          key={`${lineIndex}-${index}`}
          onClick={() => handleRouteClick(route)}
          className="userTag"
        >
          {name}
        </span>,
      );

      // Update the lastIndex
      lastIndex = index + match.length;

      return match;
    });

    // Add the remaining text after the last tag
    if (lastIndex < line.length) {
      elements.push(line.substring(lastIndex));
    }
  });

  // Convert URLs to anchor tags
  const textWithLinks = elements.map((element, index) => {
    if (typeof element === "string") {
      // Convert string to a React fragment containing anchor tags for URLs
      return (
        <React.Fragment key={index}>
          {element.split(/\b(https?:\/\/\S+|www\.\S+)\b/g).map((part, i) => {
            if (i % 2 === 0) {
              return part; // Regular text
            } else {
              const url = part.startsWith("http") ? part : `http://${part}`;
              return (
                <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                  {part}
                </a>
              );
            }
          })}
        </React.Fragment>
      );
    }
    return element;
  });

  return textWithLinks;
};

export const textPreprocessor = (
  text: string,
): {
  showReadMore: boolean;
  text: string;
} => {
  const wordsSplit = text.split(" ");
  if (wordsSplit.length <= 300) {
    return {
      text,
      showReadMore: false,
    };
  } else {
    return { showReadMore: true, text: wordsSplit.slice(0, 299).join(" ") };
  }
};

// Function to handle route click
const handleRouteClick = (route: string) => {
  alert(route); // Replace with your desired action
};
