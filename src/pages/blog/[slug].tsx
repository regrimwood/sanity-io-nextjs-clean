import { PortableText } from '@portabletext/react';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import Image from 'next/image';
import { useLiveQuery } from 'next-sanity/preview';
import { readToken } from '../../utils/sanity/sanity.api';
import getClient from '../../utils/sanity/sanity.client';
import urlForImage from '../../utils/sanity/sanity.image';
import type { SharedPageProps } from '../_app';
import formatDate from '../../utils/formatDate';
import { getAllPostsSlugs } from '../../utils/queries/getAllPostSlugs';
import { getPost, postBySlugQuery } from '../../utils/queries/getPost';
import { PostModel } from '../../utils/models/PostModel';

interface Query {
  [key: string]: string;
}

export default function ProjectSlugRoute(
  props: InferGetStaticPropsType<typeof getStaticProps>,
) {
  const [post] = useLiveQuery(props.post, postBySlugQuery, {
    slug: props.post.slug.current,
  });

  return (
    <section>
      {post.mainImage && (
        <Image
          src={urlForImage(post.mainImage).url()}
          height={231}
          width={367}
          alt=""
        />
      )}
      <div>
        <h1>{post.title}</h1>
        <p>{post.excerpt}</p>
        <p>{formatDate(post._createdAt)}</p>
        <div>
          <PortableText value={post.body} />
        </div>
      </div>
    </section>
  );
}

export const getStaticProps: GetStaticProps<
  SharedPageProps & {
    post: PostModel;
  },
  Query
> = async ({ draftMode = false, params = {} }) => {
  const slug = params?.slug;
  const client = getClient(draftMode ? { token: readToken } : undefined);
  const post = await getPost(client, slug);

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      draftMode,
      token: draftMode ? readToken : '',
      post,
      key: slug,
    },
    notFound: post === null,
  };
};

export const getStaticPaths = async () => {
  const slugs = await getAllPostsSlugs();

  return {
    paths: slugs?.map(({ slug }) => `/blog/${slug}`) || [],
    fallback: 'blocking',
  };
};
