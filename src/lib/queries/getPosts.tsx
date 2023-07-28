import { groq } from 'next-sanity';
import { type SanityClient } from 'next-sanity';
import { PostModel } from '../models/PostModel';

export const postsQuery = groq`*[_type == "post" && defined(slug.current)] | order(_createdAt desc)`;

export async function getPosts(client: SanityClient): Promise<PostModel[]> {
  return await client.fetch(postsQuery);
}
