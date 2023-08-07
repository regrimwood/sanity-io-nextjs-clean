import { PortableText } from '@portabletext/react';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { useLiveQuery } from 'next-sanity/preview';
import { readToken } from '../../utils/sanity/sanity.api';
import getClient from '../../utils/sanity/sanity.client';
import urlForImage from '../../utils/sanity/sanity.image';
import type { SharedPageProps } from '../_app';
import formatDate from '../../utils/formatDate';
import { getAllPostsSlugs } from '../../utils/queries/getAllPostSlugs';
import { getPost, postBySlugQuery } from '../../utils/queries/getPost';
import { PostModel } from '../../utils/models/PostModel';
import AnimatedImage from '~/components/AnimatedImage';
import { Box, Stack, Typography } from '@mui/material';
import ContentContainer from '~/components/ContentContainer';

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
    <ContentContainer py={{ xs: 1.875, md: 3.75 }}>
      {post.coverImage && (
        <Box
          position="relative"
          width={{ xs: '100%', md: '800px' }}
          height={{ xs: '70vh', md: '500px' }}
        >
          <AnimatedImage
            src={urlForImage(post.coverImage).url()}
            alt={post.coverImage.description}
            sizes="100vw"
          />
        </Box>
      )}
      <Stack spacing={2} mt={2}>
        <Typography variant="body1">{formatDate(post._createdAt)}</Typography>
        <Typography variant="h1">{post.title}</Typography>
        <Typography variant="h3">{post.excerpt}</Typography>
        <PortableText value={post.body} />
      </Stack>
    </ContentContainer>
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
