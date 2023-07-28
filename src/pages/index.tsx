import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { useLiveQuery } from 'next-sanity/preview';
import Card from '~/components/Card';
import Container from '~/components/Container';
import Welcome from '~/components/Welcome';
import { PostModel } from '~/lib/models/PostModel';
import { getPosts, postsQuery } from '~/lib/queries/getPosts';
import { readToken } from '~/lib/sanity.api';
import { getClient } from '~/lib/sanity.client';
import type { SharedPageProps } from '~/pages/_app';

function IndexPage(props: InferGetStaticPropsType<typeof getStaticProps>) {
  const [posts] = useLiveQuery<PostModel[]>(props.posts, postsQuery);

  return (
    <Container>
      <section>
        {posts.length ? (
          posts.map((post) => <Card key={post._id} post={post} />)
        ) : (
          <Welcome />
        )}
      </section>
    </Container>
  );
}

export const getStaticProps: GetStaticProps<
  SharedPageProps & {
    posts: PostModel[];
  }
> = async ({ draftMode = false }) => {
  const client = getClient(draftMode ? { token: readToken } : undefined);
  const posts = await getPosts(client);

  return {
    props: {
      draftMode,
      token: draftMode ? readToken : '',
      posts,
    },
  };
};

export default IndexPage;
