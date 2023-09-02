export type TPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  categories: number[];
};

type TCategory = {
  id: number;
  name: string;
  slug: string;
};

export type TResponseData = {
  posts: TPost[];
  categories: TCategory[];
  hasNext: boolean;
  hasPrev: boolean;
};