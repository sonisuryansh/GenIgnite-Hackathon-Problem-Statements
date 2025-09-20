
export type NftOwner = {
  address: string;
  timestamp: number;
};

export type Nft = {
  hash: string;
  title: string;
  description: string;
  content: string;
  owners: NftOwner[];
  imageUrl: string;
  imageHint: string;
};
