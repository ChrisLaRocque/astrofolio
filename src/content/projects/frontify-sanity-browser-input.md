---
title: Frontify DAM integration for Sanity Studio
description: Hacked together integration between Frontify and Sanity, allowing you to use Frontify assets in your Sanity content.
tech: [sanity, react, typescript]
updatedAt: 2025-04-20T00:00:00-05:00
---

## Don't use this code

In the time since I've created this example Frontify has come out with a better, [official version](https://www.sanity.io/plugins/frontify-dam). Specifically it makes the plugin an [asset source](https://www.sanity.io/docs/studio/custom-asset-sources) and uses the user's auth to access Frontify instead of a provided token.

## Setup

### Install the Frontify Finder package

```bash
pnpm i @frontify/frontify-finder
```

### Creating the necessary files

We're going to create a Sanity plugin for this input. Plugins can be local to your Studio code or published as NPM packages to be shared and reused. Sanity also has a toolkit called [`plugin-kit`](https://github.com/sanity-io/plugin-kit) to streamline plugin development. For the sake of this walkthrough we'll create the plugin locally.

In your Sanity project create a directory called `plugins` with a directory for our new `frontify` plugin with the following structure:

```bash {5-11}
.
├── schemaTypes/
│   ├── documents
│   └── objects
├── plugins/
│   └── frontify/
│       ├── components/
│       │   └── frontify-browser.tsx
│       ├── hooks/
│       │   └── use-finder.ts
│       └── index.ts
├── sanity.config.ts
└── sanity.cli.ts
```

## The hook (`use-finder.ts`)

```ts title="use-finder.ts"
import { useRef, useCallback, useState, Dispatch, SetStateAction } from 'react';
import { create } from '@frontify/frontify-finder';
import { ObjectInputProps, set } from 'sanity';
// getting a clientId from the Frontify API https://developer.frontify.com/d/xJoA5nhTq1AT/finder#/details-and-concepts/oauth2-client

export const useFinder = (
  props: ObjectInputProps,
  setIsModalOpen: Dispatch<SetStateAction<boolean>>
) => {
  const [isLoading, setIsLoading] = useState(false);

  const openFinder = useCallback(async () => {
    setIsLoading(true);

    try {
      const finder = await create({
        clientId: process.env.SANITY_STUDIO_FRONTIFY_ID ?? '', // Replace with your actual client ID
      });

      finder.onAssetsChosen((assets) => {
        console.log(assets);
        props.onChange(set(assets[0]));
        setIsLoading(false);
        setIsModalOpen(false);
      });

      finder.onCancel(() => {
        const modal = document.getElementById('finderContainer');
        if (modal) modal.remove();
        setIsLoading(false);
      });

      const modalElement = document.getElementById('finderContainer');
      if (modalElement) {
        finder.mount(modalElement);
      } else {
        console.error('Finder modal container not found.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }, []);

  return { openFinder, isLoading };
};
```

In this file we wrap Frontify's Finder in a React hook. We specifically handle selecting an asset (`finder.onAssetsChosen`) and using `set` to update the Sanity Content Lake, as well as handling state for showing/hiding the modal containing the Finder.

The code in this example contains the Frontify client ID as an environment variable. As Sanity is bundled as a client-side React application this is technically not a great practice to fall into. Luckily packages like [`sanity-studio-secrets`](https://github.com/sanity-io/sanity-studio-secrets) exist to store sensitive tokens in your Sanity dataset. It would be worthwhile in your own code to defer to that plugin over using environment variables for sensistive keys.

## The component (`frontify-browser.tsx`)

```tsx title="frontify-browser.tsx"
import { useState, useEffect } from 'react';
import { useFinder } from '../hooks/use-finder';
import { ObjectInputProps } from 'sanity';
import { Dialog, Button, Box, Card, Text } from '@sanity/ui';

export const FrontifyBrowser = (props: ObjectInputProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { openFinder, isLoading } = useFinder(props, setIsModalOpen);

  const handleOpenFinder = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (isModalOpen) {
      // Ensure the Finder is mounted only after the modal is rendered
      const modalElement = document.getElementById('finderContainer');
      if (modalElement) {
        openFinder();
      }
    }
  }, [isModalOpen, openFinder]);

  const currentValue = props.value as { thumbnailUrl?: string } | undefined;

  return (
    <>
      <Box>
        {currentValue?.thumbnailUrl ? (
          <Card padding={2} shadow={1} radius={2}>
            <img
              src={currentValue.thumbnailUrl}
              alt="Selected asset thumbnail"
              style={{ width: '100%', borderRadius: '4px' }}
            />
          </Card>
        ) : (
          <Text muted>No asset selected</Text>
        )}
      </Box>
      <Button
        text={isLoading ? 'Loading...' : 'Open Finder'}
        onClick={handleOpenFinder}
        disabled={isLoading}
        tone="primary"
      />
      {isModalOpen && (
        <Dialog
          header="Frontify Finder"
          id="finderModal"
          onClose={handleCloseModal}
          width={3} // Adjust the width of the modal
        >
          <div
            id="finderContainer"
            style={{
              height: '80vh', // Adjust the height of the Finder container
              width: '100%',
              overflow: 'hidden',
            }}
          ></div>
        </Dialog>
      )}
    </>
  );
};
```

The `frontify-browser.tsx` file is a custom input component that works with the `useFinder` hook to show/hide the finder. We'll set it as the input component for our custom schema in a moment.

## Pull it all together (`index.ts`)

In the `index.ts` file we declare the plugin and the custom schema for Frontify assets.

```ts title="index.ts"
import { definePlugin } from 'sanity';
import { FrontifyBrowser } from './components/frontify-browser';
/**
 * This plugin is a wrapper around the Frontify Finder, which allows you to select assets from your Frontify account.
 * Sanity plugins are defined using the `definePlugin` function and are packaged sets of configuration options for schemas, inputs, tools, or other Studio functionality you want to package and share
 * The plugin is registered in the Sanity Studio configuration file.
 */
export const frontifySelector = definePlugin({
  name: 'frontify-selector',
  schema: {
    // This is a copy of what I saw coming from the Frontify browser for images, the actual schema may need to be changed depending on the type of asset you sync
    types: [
      {
        name: 'frontifyAsset',
        type: 'object',
        fields: [
          { name: 'author', type: 'string', title: 'Author' },
          {
            name: 'copyright',
            type: 'object',
            title: 'Copyright',
            fields: [
              { name: 'status', type: 'string', title: 'Status' },
              { name: 'notice', type: 'string', title: 'Notice' },
            ],
          },
          { name: 'createdAt', type: 'datetime', title: 'Created At' },
          {
            name: 'creator',
            type: 'object',
            title: 'Creator',
            fields: [{ name: 'name', type: 'string', title: 'Name' }],
          },
          { name: 'description', type: 'string', title: 'Description' },
          { name: 'downloadUrl', type: 'url', title: 'Download URL' },
          {
            name: 'dynamicPreviewUrl',
            type: 'url',
            title: 'Dynamic Preview URL',
          },
          { name: 'expiresAt', type: 'datetime', title: 'Expires At' },
          { name: 'extension', type: 'string', title: 'Extension' },
          { name: 'filename', type: 'string', title: 'Filename' },
          { name: 'focalPoint', type: 'string', title: 'Focal Point' },
          { name: 'height', type: 'number', title: 'Height' },
          { name: 'id', type: 'string', title: 'ID' },
          {
            name: 'licenses',
            type: 'array',
            title: 'Licenses',
            of: [{ type: 'string' }],
          },
          {
            name: 'metadataValues',
            type: 'array',
            title: 'Metadata Values',
            of: [{ type: 'string' }],
          },
          { name: 'previewUrl', type: 'url', title: 'Preview URL' },
          { name: 'size', type: 'number', title: 'Size' },
          {
            name: 'tags',
            type: 'array',
            title: 'Tags',
            of: [{ type: 'string' }],
          },
          { name: 'thumbnailUrl', type: 'url', title: 'Thumbnail URL' },
          { name: 'title', type: 'string', title: 'Title' },
          { name: 'type', type: 'string', title: 'Type' },
          { name: 'width', type: 'number', title: 'Width' },
        ],
        components: {
          input: FrontifyBrowser,
        },
      },
    ],
  },
});
```

Sanity plugins are defined as objects, using the `definePlugin` helper to give us proper types. Plugins in Sanity are just preset parts of the Sanity configuration file, meaning we can do things like set schema types that are then re-usable in other Studios.

As you can see we declare a schema matching the data structure of Frontify assets. We also override the input component type with the `FrontifyBrowser` component from the previous step.

Finally, add the plugin to your `sanity.config.ts` file:

```ts title="sanity.config.ts"
import { defineConfig } from 'sanity';
import { frontifySelector } from './plugins/frontify';

export default defineConfig({
  // ...rest of Sanity config file
  plugins: [frontifySelector()],
});
```
