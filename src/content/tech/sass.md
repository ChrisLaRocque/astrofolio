---
title: SASS
description: Sass is the most mature, stable, and powerful professional grade CSS extension language in the world.
homepage: https://sass-lang.com/
---

SASS was the backbone of the BEM system set up at Spartan Race. I try to avoid the need for a preprocessor when possible, but find the syntax of SASS second to none.

## Spartan Race

Rebuilding Spartan Race's websites using a BEM convention for component styles was _so_ easy with SASS, whose syntax lends itself easily towards nesting styles and their variations as you'd expect in BEM.

## Brightcove

Brightcove was unfortunately a bit of a hodge-podge between styled-components and SASS. We repeatedly had issues with styled-components flashing styles and shifting layouts, so when possible we stuck to SASS to prevent our styles relying on React's runtime.
