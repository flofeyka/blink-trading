export const shortenString = (str: string, startLength = 3, endLength = 4) => {
    if (str.length <= startLength + endLength) return str;
    return `${str.slice(0, startLength)}...${str.slice(-endLength)}`;
};
