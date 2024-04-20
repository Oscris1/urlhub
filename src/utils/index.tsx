export const shortenLink = (link: string, maxLength = 60) => {
  if (link.length > maxLength) {
    return link.substring(0, maxLength - 3) + '...';
  } else {
    return link;
  }
};
