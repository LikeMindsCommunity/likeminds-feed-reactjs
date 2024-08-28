/* eslint-disable @typescript-eslint/no-unused-vars */
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
const handleRouteClick = (route?: string) => {
  // alert(route); // Replace with your desired action
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setTagUserImage(user: any) {
  const imageLink = user?.imageUrl;
  if (imageLink !== "") {
    return (
      <img
        src={imageLink}
        alt={""}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
        }}
      />
    );
  } else {
    return (
      <div
        style={{
          minWidth: "36px",
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#5046e5",
          fontSize: "14px",
          fontWeight: "bold",
          color: "#fff",
          letterSpacing: "1px",
        }}
        className="reply-editor"
      >
        {user?.name?.split(" ").map((part: string) => {
          return part.charAt(0)?.toUpperCase();
        })}
      </div>
    );
  }
}
interface MatchPattern {
  type: number;
  displayName?: string;
  routeId?: string;
  link?: string;
}
export function convertTextToHTML(text: string) {
  const regex =
    /<<.*?>>|(?:https?|ftp):\/\/[^\s/$.?#].[^\s]*|www\.[^\s/$.?#].[^\s]*/g;
  const matches = text?.match(regex) || [];
  const splits = text?.split(regex);

  const container = document.createElement("div");

  for (let i = 0; i < splits?.length; i++) {
    const splitNode = document.createTextNode(splits[i]);
    container.appendChild(splitNode);

    if (matches[i]) {
      const text = matches[i];
      const getInfoPattern = /<<([^|]+)\|([^>>]+)>>/;
      const match = text.match(getInfoPattern);
      const userObject: MatchPattern = {
        type: 1,
      };
      if (match) {
        const userName = match[1];
        const userId = match[2];
        userObject.displayName = userName;
        userObject.routeId = userId;
      } else {
        userObject.type = 2;
        userObject.link = text;
      }
      if (userObject.type === 1) {
        // const matchText = matches[i].slice(2, -2); // Remove '<<' and '>>'
        const linkNode = document.createElement("a");
        linkNode.href = "#"; // You can set the appropriate URL here
        linkNode.textContent = userObject.displayName!;
        linkNode.id = userObject.routeId!;
        container.appendChild(linkNode);
      } else {
        const linkNode = document.createElement("a");
        linkNode.href = userObject.link!; // You can set the appropriate URL here
        linkNode.textContent = userObject.link!;
        container.appendChild(linkNode);
      }
    }
  }

  return container;
}
