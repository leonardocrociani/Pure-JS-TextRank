# Pure-Js TextRank Algorithm

Implementing the TextRank algorithm in pure JavaScript for text summarization.

## Overview

TextRank, an unsupervised graph-based ranking algorithm, is adept at condensing text. This implementation draws inspiration from Google's PageRank, applying it to a graph composed of sentences as nodes, each weighted by saliency. Edges represent sentence similarities, forming the basis for the ranking process.

## Customizable Parameters

This implementation offers flexibility through four key parameters:

- **encoding:** Choose between two sentence considerations: "as_it_is" or "bag_of_words".
- **distance:** Four distance metrics available: "jaccard", "custom", "dice_coefficient", and "overlap".
- **alfa:** A pivotal factor in the PageRank algorithm, influencing ranking computation. (The so-called [*dumping factor*](https://en.wikipedia.org/wiki/PageRank#:~:text=Damping%20factor%5B,set%20around%200.85))
- **pr_iterations:** Control the number of PageRank iterations for precision.

Additionally, you can determine the number of top-sentences to extract by providing a function to the `summarize()` method. For instance:

```javascript
tr.summarize(sentences => Math.floor(sentences.length * 0.1));
```

## Example

*Available also in ./index.js*

```javascript
const TextRank = require('./TextRank');

const encodings = [
    'bag_of_word',
    'as_they_are'
]

const distances = [
    'jaccard', 
    'custom', 
    'overlap',
    'dice_coefficient'
]

const tr = new TextRank({
    encoding: encodings[0],
    distance: distances[0],
    alfa: 0.85,
    pr_iteration : 100
});

tr.load('./test.txt');

const summary = tr.summarize();

console.log(summary);
```
