export const shortenString = (text: string, end: number = 180) => {
  return text?.length > end ? `${text.slice(0, end)}...` : text;
};

export const shortenAddress = (address?: string) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
