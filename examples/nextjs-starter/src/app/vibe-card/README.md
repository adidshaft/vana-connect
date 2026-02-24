# The Ultimate Vibe Card UI

This directory contains the "Ultimate Vibe Card" UI, built for the Vana Connect SDK, utilizing a strict minimalist brutalist aesthetic inspired by Paradigm.xyz.

## Overview

The Vibe Card UI allows users to authenticate various services (Spotify, ChatGPT, LinkedIn, Instagram) and generates a unified digital personality receipt based on the resulting Vana data payload.

## Features

- **Strict Aesthetic:** Uses `bg-offwhite` (#FAF9F6) and `text-pureblack` (#000000), strict CSS grids, 1px solid black borders, and a global monospace font hierarchy (`font-mono`).
- **Data Mappings:**
  - **Spotify:** Mapped to "Current Mood"
  - **ChatGPT:** Mapped to "Mind Palace"
  - **LinkedIn:** Mapped to "Current Grind"
  - **Instagram:** Mapped to "Aesthetic"
- **Interactive Connect State:** Four hard-edged buttons toggle the connection state. Connected buttons invert their colors.
- **Generate Card:** Appears only when at least two services are linked.
- **Identity Receipt:** A digital terminal readout displaying capitalized labels and mapped data values.

## File Structure

- `page.tsx`: The main Next.js component containing the Connect State buttons, the layout, and the Identity Receipt render.
- `useVibeCardMappers.ts`: A custom React hook containing the dummy data structure and the mapping logic to convert raw Vana payloads into Vibe Card traits.

## Setup

Ensure your `tailwind.config.ts` has the following color extensions:

```typescript
{
  theme: {
    extend: {
      colors: {
        offwhite: "#FAF9F6",
        pureblack: "#000000",
      },
    },
  },
}
```

And that your `globals.css` applies `@apply bg-offwhite text-pureblack font-mono;` to the `body`.
