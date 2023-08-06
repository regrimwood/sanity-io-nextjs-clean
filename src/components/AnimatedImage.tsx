import { Box, BoxProps, styled } from '@mui/material';
import { animated, SpringValue, useSpring } from '@react-spring/web';
import Image, { StaticImageData } from 'next/image';
import React from 'react';
import MissingImage from '../assets/images/Missing.png';

const ImageWrapper = styled(animated(Box))(() => ({
  zIndex: 0,
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  overflow: 'hidden',
}));

interface Props extends BoxProps {
  src?: string | StaticImageData;
  objectFit?: React.CSSProperties['objectFit'];
  alt?: string;
  quality?: number;
  priority?: boolean;
  sizes: string;
  zoom?: number | SpringValue<number>;
  style?: React.CSSProperties;
  delay?: number;
}

export default function AnimatedImage(props: Props) {
  const {
    src,
    alt = '',
    objectFit = 'cover',
    quality = 75,
    priority,
    sizes,
    zoom = 1,
    style,
    delay = 0,
    ...restProps
  } = props;

  const [loading, setLoading] = React.useState(true);

  const spring = useSpring({
    opacity: loading ? 0 : 1,
    delay,
  });

  const zoomSpring = useSpring({
    scale: zoom,
    delay,
  });

  const AImage = animated(Image);

  return (
    <ImageWrapper style={spring} {...restProps}>
      <AImage
        style={{ objectFit, ...zoomSpring, ...style }}
        src={src ?? MissingImage}
        alt={alt}
        quality={quality}
        onLoadingComplete={() => setLoading(false)}
        draggable={false}
        priority={priority}
        sizes={sizes}
        fill
      />
    </ImageWrapper>
  );
}
