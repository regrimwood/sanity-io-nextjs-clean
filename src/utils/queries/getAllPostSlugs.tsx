import { groq } from 'next-sanity';
import type { Slug } from '@sanity/types';
import { PostModel } from '../models/PostModel';
import getClient from '../sanity/sanity.client';

export const postSlugsQuery = groq`
*[_type == "post" && defined(slug.current)][].slug.current
`;

export async function getAllPostsSlugs(): Promise<Pick<PostModel, 'slug'>[]> {
  const client = getClient();
  const slugs = (await client.fetch<Slug[]>(postSlugsQuery)) || [];
  return slugs.map((slug) => ({ slug }));
}
