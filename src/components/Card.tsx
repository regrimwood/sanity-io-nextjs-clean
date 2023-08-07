import React from 'react';
import { Box, Stack, Typography, alpha, styled, useTheme } from '@mui/material';
import { Button } from '@mui/base';
import AnimatedImage from './AnimatedImage';
import { useHover } from '@use-gesture/react';
import { animated, config, useSpring } from '@react-spring/web';
import { PostPartialModel } from '../utils/models/PostModel';
import urlForImage from '../utils/sanity/sanity.image';
import resolveHref from '../utils/sanity/sanity.links';
import formatDate from '../utils/formatDate';
import LinkButton from './Buttons/LinkButton';

interface RootProps {
  disableSliderStyles: boolean;
}

const Root = styled(Button, {
  shouldForwardProp: (propName) => propName !== 'disableSliderStyles',
})<RootProps>(({ theme, disableSliderStyles }) => ({
  display: 'block',
  width: disableSliderStyles ? '100%' : 'calc(100vw - 50px)',
  height: '100%',
  border: 'none',
  background: 'transparent',
  padding: 0,
  cursor: 'pointer',
  [theme.breakpoints.up('sm')]: {
    width: disableSliderStyles ? '100%' : 'calc(50vw - 50px)',
  },
  [theme.breakpoints.up('lg')]: {
    width: '100%',
  },
}));

const ImageWrapper = styled(animated.div)(() => ({
  aspectRatio: '312/399',
  position: 'relative',
}));

const Overlay = styled(animated.div)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  height: '100%',
  width: '100%',
  boxShadow: `inset ${alpha(
    theme.palette.common.charcoal,
    0.2,
  )} 0px 0px 50px 20px`,
}));

interface Props {
  post: PostPartialModel;
  disableSliderStyles?: boolean;
}

export default function Card(props: Props) {
  const { post, disableSliderStyles } = props;
  const { _type, slug, title, coverImage, _createdAt } = post;

  const href = resolveHref(_type, slug.current);

  const theme = useTheme();
  const { sm, md } = theme.breakpoints.values;
  const [isHovering, setIsHovering] = React.useState(false);

  const bind = useHover(({ hovering }) => {
    setIsHovering(hovering ?? false);
  });

  const { transform, opacity } = useSpring({
    transform: isHovering ? 'scale(1.03)' : 'scale(1)',
    opacity: isHovering ? 1 : 0,
    config: config.slow,
  });

  return (
    <Root
      {...bind()}
      disableSliderStyles={disableSliderStyles ?? false}
      href={href}
    >
      {coverImage && (
        <Box overflow="hidden" position="relative">
          <ImageWrapper style={{ transform }}>
            <AnimatedImage
              src={urlForImage(coverImage).url()}
              sizes={`(max-width: ${sm}px) 100vw, (max-width: ${md}px) 50vw, 25vw`}
            />
          </ImageWrapper>
          <Overlay style={{ opacity }} />
        </Box>
      )}
      <Stack
        direction="row"
        mt={1.25}
        justifyContent="space-between"
        alignItems="center"
      >
        <LinkButton
          typographyVariant="h3"
          label={title ?? ''}
          containerIsHovering={isHovering}
          underlinePadding={0.2}
        />
        <Typography variant="body1" textAlign="right">
          {formatDate(_createdAt) ?? ''}
        </Typography>
      </Stack>
    </Root>
  );
}
