import type { ImageAsset, Slug } from '@sanity/types';
import type { PortableTextBlock } from '@portabletext/types';

export interface PostPartialModel {
  _type: 'post';
  _id: string;
  _createdAt: string;
  title?: string;
  coverImage?: ImageAsset;
  slug: Slug;
  excerpt?: string;
}

export interface PostModel {
  _type: 'post';
  _id: string;
  _createdAt: string;
  title?: string;
  coverImage?: ImageAsset;
  slug: Slug;
  excerpt?: string;
  body: PortableTextBlock[];
}
