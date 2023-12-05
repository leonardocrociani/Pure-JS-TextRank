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