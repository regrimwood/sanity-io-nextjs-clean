import { PortableText, PortableTextComponents } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';
import AnimatedImage from './AnimatedImage';
import type { Image } from 'sanity';
import { Box, Typography } from '@mui/material';
import Link from 'next/link';
import urlForImage from '~/utils/sanity/sanity.image';

export function PortableTextBlock({ value }: { value: PortableTextBlock[] }) {
  const components: PortableTextComponents = {
    block: {
      normal: ({ children }) => {
        return <Typography>{children}</Typography>;
      },
    },
    marks: {
      link: ({ children, value }) => {
        return (
          <Link href={value?.href} rel="noreferrer noopener">
            {children}
          </Link>
        );
      },
    },
    types: {
      image: ({
        value,
      }: {
        value: Image & { alt?: string; caption?: string };
      }) => {
        return (
          <Box position="relative">
            <AnimatedImage
              src={urlForImage(value).url()}
              alt={value.alt}
              sizes="100vw"
            />
            {value?.caption && (
              <Typography variant="caption">{value.caption}</Typography>
            )}
          </Box>
        );
      },
    },
  };

  return <PortableText components={components} value={value} />;
}
