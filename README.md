# Pure-Js TextRank Algorithm

Implementing the TextRank algorithm in pure JavaScript for text summarization.

## Overview

TextRank, an unsupervised graph-based ranking algorithm, is adept at condensing text. This implementation draws inspiration from Google's PageRank, applying it to a graph composed of sentences as nodes, each weighted by saliency. Edges represent sentence similarities, forming the basis for the ranking process.

## Customizable Parameters

This implementation offers flexibility through four key parameters:

- **encoding:** Choose between two sentence considerations: "as_it_is" or "bag_of_words".
- **distance:** Four distance metrics available: "jaccard", "custom", "dice_coefficient", and "overlap".
- **alfa:** A pivotal factor in the PageRank algorithm, influencing ranking computation. (Explanatory link included)
- **pr_iterations:** Control the number of PageRank iterations for precision.

Additionally, you can determine the number of top-sentences to extract by providing a function to the `summarize()` method. For instance:

```javascript
r.summarize(sentences => Math.floor(sentences.length * 0.1));
```
---

## Example

Refer to **'./index.js'** for a practical example
