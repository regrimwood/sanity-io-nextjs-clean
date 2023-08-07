import { groq } from 'next-sanity';
import { type SanityClient } from 'next-sanity';
import { HomePageModel } from '../models/HomePageModel';

export const homePageQuery = groq`
  *[_type == "home"][0]{
    _id,
    footer,
    title,
    overview,
    showcasePosts[]->{
      _type,
      _id,
      _createdAt,
      title,
      coverImage,
      excerpt,
      slug,
      tags,
    },
  }
`;

export async function getHomePage(
  client: SanityClient,
): Promise<HomePageModel> {
  return await client.fetch(homePageQuery);
}
