import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { useLiveQuery } from 'next-sanity/preview';
import Card from '../components/Card';
import Welcome from '../components/Welcome';
import { PostModel } from '../utils/models/PostModel';
import { getPosts, postsQuery } from '../utils/queries/getPosts';
import { readToken } from '../utils/sanity/sanity.api';
import getClient from '../utils/sanity/sanity.client';
import type { SharedPageProps } from '../pages/_app';

function IndexPage(props: InferGetStaticPropsType<typeof getStaticProps>) {
  const [posts] = useLiveQuery<PostModel[]>(props.posts, postsQuery);

  return (
    <section>
      {posts.length ? (
        posts.map((post) => <Card key={post._id} post={post} />)
      ) : (
        <Welcome />
      )}
    </section>
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
