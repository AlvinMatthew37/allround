# Monkeytype feature structure

This document explains how the Monkeytype page and its components are organized.

## Where the page lives

- `src/pages/Monkeytype.vue`

This is the **page/controller** for the Monkeytype route.

It owns the logic for:

- fetching the word bank
- generating the test words
- handling keyboard input
- tracking accuracy / WPM / timer state
- saving user preferences in `localStorage`

It passes the current state down into the UI components as props.

## Where the reusable components live

- `src/components/projects/monkeytype/GameContainer.vue`
- `src/components/projects/monkeytype/Toolbar.vue`
- `src/components/projects/monkeytype/LiveStats.vue`
- `src/components/projects/monkeytype/ResultOverlay.vue`

These are the UI pieces that the page uses.

### `GameContainer.vue`
This is the **visual word display**.

It is responsible for:

- rendering each word
- rendering each letter inside each word
- showing correct / incorrect letter colors
- showing the caret position
- showing the finish overlay slot

It still uses **letter-level rendering** because the typing test needs to know the state of each individual character.

### Why the letters are stored individually
The page tracks each word as an object with a `letters[]` array.

That makes it easy to:

- validate every typed character
- move the caret one character at a time
- support backspace at the letter level
- mark letters and words as correct or incorrect

## Component relationship

The structure is:

```txt
Monkeytype.vue (page / logic)
└── GameContainer.vue (word + letter rendering)
    ├── Toolbar.vue
    ├── LiveStats.vue
    └── ResultOverlay.vue
```

## Exposed methods from `GameContainer.vue`

The page does **not** reach into raw DOM refs anymore.

Instead, `GameContainer.vue` exposes a small public API:

- `resetView()`  
  Scrolls the typing box back to the top and focuses it.

- `scrollToWord(index, direction)`  
  Handles word scrolling after backspace or when advancing to the next word.

This keeps the page logic cleaner while still allowing the page to control the typing experience.

