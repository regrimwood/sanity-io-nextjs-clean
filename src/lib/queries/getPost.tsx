import { groq } from 'next-sanity';
import { type SanityClient } from 'next-sanity';
import { PostModel } from '../models/PostModel';

export const postBySlugQuery = groq`*[_type == "post" && slug.current == $slug][0]`;

export async function getPost(
  client: SanityClient,
  slug: string,
): Promise<PostModel> {
  return await client.fetch(postBySlugQuery, {
    slug,
  });
}
