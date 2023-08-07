import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { useLiveQuery } from 'next-sanity/preview';
import Card from '../components/Card';
import { readToken } from '../utils/sanity/sanity.api';
import getClient from '../utils/sanity/sanity.client';
import type { SharedPageProps } from '../pages/_app';
import ContentContainer from '~/components/ContentContainer';
import { getHomePage, homePageQuery } from '~/utils/queries/getHomePage';
import { HomePageModel } from '~/utils/models/HomePageModel';
import { Box, Grid, Typography, useMediaQuery, useTheme } from '@mui/material';
import { PortableTextBlock } from '~/components/PortableTextBlock';
import AnimationFadeIn from '~/components/Animation/AnimationFadeIn';
import HorizontalSlider from '~/components/Sliders/HorizontalSlider';
import { REVALIDATE_PAGES } from '~/utils/globals';

interface HomePageProps {
  page: HomePageModel;
  preview?: boolean;
  loading?: boolean;
}

function HomePage(props: HomePageProps) {
  const { page } = props;
  const { title, overview, showcasePosts = [] } = page;

  const theme = useTheme();

  const isTablet = useMediaQuery(theme.breakpoints.up('md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  return (
    <Box py={{ xs: 1.875, md: 3.75 }}>
      <ContentContainer mb={{ xs: 1.875, md: 3.75 }}>
        <Typography variant="h1" mb={{ xs: 1.875, md: 3.75 }}>
          {title}
        </Typography>
        {overview && <PortableTextBlock value={overview} />}
        <Typography variant="h2" mt={{ xs: 1.875, md: 3.75 }}>
          Posts
        </Typography>
      </ContentContainer>
      {isDesktop ? (
        <ContentContainer>
          <AnimationFadeIn threshold={0.1}>
            <Grid container spacing={2.5}>
              {showcasePosts.map((post) => (
                <Grid item xs={3} key={post._id}>
                  <Card post={post} />
                </Grid>
              ))}
            </Grid>
          </AnimationFadeIn>
        </ContentContainer>
      ) : (
        <AnimationFadeIn threshold={0.3}>
          <HorizontalSlider px={isTablet ? 3.75 : 1.875}>
            {showcasePosts.map((post) => (
              <Card post={post} key={post._id} />
            ))}
          </HorizontalSlider>
        </AnimationFadeIn>
      )}
    </Box>
  );
}

function HomePagePreview({ page: initialPage }: HomePageProps) {
  const [page, loading] = useLiveQuery<HomePageModel | null>(
    initialPage,
    homePageQuery,
  );

  if (!page) {
    return (
      <Typography>
        Please start editing your Home document to see the preview!
      </Typography>
    );
  }

  return <HomePage page={page} preview loading={loading} />;
}

function IndexPage(props: InferGetStaticPropsType<typeof getStaticProps>) {
  const { page, draftMode } = props;

  if (draftMode) {
    return <HomePagePreview page={page} />;
  }

  return <HomePage page={page} />;
}

const fallbackPage: HomePageModel = {
  title: '',
  overview: [],
  showcasePosts: [],
};

export const getStaticProps: GetStaticProps<
  SharedPageProps & {
    page: HomePageModel;
  }
> = async ({ draftMode = false }) => {
  const client = getClient(draftMode ? { token: readToken } : undefined);
  const page = await getHomePage(client);

  return {
    props: {
      draftMode,
      token: draftMode ? readToken : '',
      page: page ?? fallbackPage,
    },
    revalidate: REVALIDATE_PAGES,
  };
};

export default IndexPage;
