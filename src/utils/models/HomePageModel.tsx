import type { PortableTextBlock } from '@portabletext/types';
import type { Image } from 'sanity';
import { PostPartialModel } from './PostModel';

export interface HomePageModel {
  footer?: PortableTextBlock[];
  overview?: PortableTextBlock[];
  showcasePosts?: PostPartialModel[];
  title?: string;
}
