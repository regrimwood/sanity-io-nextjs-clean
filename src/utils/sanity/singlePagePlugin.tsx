/**
 * This plugin contains all the logic for setting up the singletons
 */

import { ComponentType, ReactNode } from 'react';
import { definePlugin, type DocumentDefinition } from 'sanity';
import { type StructureResolver } from 'sanity/desk';

export default function singlePagePlugin(types: string[]) {
  return definePlugin({
    name: 'singlePagePlugin',
    document: {
      // Hide 'Singletons' (such as Home) from new document options
      newDocumentOptions: (prev, { creationContext }) => {
        if (creationContext.type === 'global') {
          return prev.filter(
            (templateItem) => !types.includes(templateItem.templateId),
          );
        }

        return prev;
      },

      // Removes the "duplicate" action on the Singletons (such as Home)
      actions: (prev, { schemaType }) => {
        if (types.includes(schemaType)) {
          return prev.filter(({ action }) => action !== 'duplicate');
        }

        return prev;
      },
    },
  });
}
