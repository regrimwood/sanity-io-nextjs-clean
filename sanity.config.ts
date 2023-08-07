/**
 * This config is used to set up Sanity Studio that's mounted on the `/pages/studio/[[...index]].tsx` route
 */

import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';

// see https://www.sanity.io/docs/api-versioning for how versioning works
import {
  apiVersion,
  dataset,
  previewSecretId,
  projectId,
} from '~/utils/sanity/sanity.api';
import { schema } from '~/schemas';
import homePage from '~/schemas/pages/homePage';
import post from '~/schemas/post';
import deskToolStructure from '~/utils/sanity/deskToolStructure';
import productionUrl from '~/utils/productionUrl';
import singlePagePlugin from '~/utils/sanity/singlePagePlugin';

export const PREVIEWABLE_DOCUMENT_TYPES: string[] = [homePage.name, post.name];

export default defineConfig({
  basePath: '/studio',
  name: 'my-project',
  title: 'My Project',
  projectId,
  dataset,
  schema,
  plugins: [
    deskTool({
      structure: deskToolStructure([homePage]),
    }),
    singlePagePlugin([homePage.name]),
    // Vision lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
    productionUrl({
      previewSecretId,
      types: PREVIEWABLE_DOCUMENT_TYPES,
      apiVersion,
    }),
  ],
});
