import createImageUrlBuilder from '@sanity/image-url';
import type { Image } from 'sanity';
import MissingImage from '../../assets/images/Missing.png';

import { dataset, projectId } from '~/utils/sanity/sanity.api';

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
});

export default function urlForImage(source: Image) {
  // Ensure that source image contains a valid reference
  if (!source?.asset?._ref) {
    return imageBuilder?.image(MissingImage).auto('format');
  }

  return imageBuilder?.image(source).auto('format');
}
