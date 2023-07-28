import { ComponentType, ReactNode } from 'react';
import { DocumentDefinition } from 'sanity';
import { StructureResolver } from 'sanity/desk';

// The StructureResolver is how we're changing the DeskTool structure for single pages
export default function deskToolStructure(
  typeDefArray: DocumentDefinition[],
): StructureResolver {
  return (S) => {
    // Goes through all of the singletons that were provided and translates them into something the
    // Desktool can understand
    const singletonItems = typeDefArray.map((typeDef) => {
      return S.listItem()
        .title(typeDef.title!)
        .icon(typeDef.icon as ReactNode | ComponentType<{}>)
        .child(
          S.editor()
            .id(typeDef.name)
            .schemaType(typeDef.name)
            .documentId(typeDef.name)
            .views([
              // Default form view
              S.view.form(),
            ]),
        );
    });

    // The default root list items (except custom ones)
    const defaultListItems = S.documentTypeListItems().filter(
      (listItem) =>
        !typeDefArray.find((singleton) => singleton.name === listItem.getId()),
    );

    return S.list()
      .title('Content')
      .items([...singletonItems, S.divider(), ...defaultListItems]);
  };
}
