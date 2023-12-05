const { stopwords_it } = require('./res')

const encodings = {
    bag_of_word: (sent) =>
        remove_stopwords(
            Array.from(
                new Set(
                    sent.split(' ')
                        .map(el =>
                            el.trim()
                        )
                )
            )
        ),
    as_they_are: (sent) =>
        remove_stopwords(
            sent
                .split(' ')
                .map(el =>
                    el
                        .trim()
                        .toLowerCase()
                )
        ),
}


const distances = {
    jaccard: (s1, s2) =>
        intersection(s1, s2).length / union(s1, s2).length,

    custom: (s1, s2) =>
        intersection(s1, s2).length / (Math.log10(s1.length) + Math.log10(s2.length)),

    overlap: (s1, s2) =>
        intersection(s1, s2).length / Math.min(s1.length, s2.length),

    dice_coefficient: (s1, s2) =>
        (2 * intersection(s1, s2).length) / s1.length + s2.length,
}

const intersection = (set1, set2) => {
    const arr = [];
    for (let i = 0; i < set1.length; i++) {
        if (set2.includes(set1[i])) {
            arr.push(set1[i]);
        }
    }
    return arr;
}

const union = (set1, set2) => {
    const arr = [...set1];
    for (const item of set2) {
        if (!arr.includes(item)) {
            arr.push(item);
        }
    }
    return arr;
}

const get_tf_idf = (sentences, content) => {
    const dictionary = {};

    for (const sentence of sentences) {
        for (const word of sentence.split(' ')) {
            if (word in dictionary) {
                dictionary[word]++;
            }
            else {
                dictionary[word] = 1;
            }
        }
    }

    const idfs = {};

    for (const word in dictionary) {
        let sentence_including_word = 0;
        for (const sentence of sentences) {
            if (sentence.includes(word)) {
                sentence_including_word++;
            }
        }
        idfs[word] = Math.log2(sentences.length / sentence_including_word);
    }

    const tf_idf = {};

    for (const word in idfs) {
        let idf = idfs[word];
        let sentence_arr = [];
        for (const sentence of sentences) {
            let word_occ = 0;
            let tokenized = tokenize(sentence);
            for (const token of tokenized) {
                if (token.trim() == word) {
                    word_occ++;
                }
            }
            const tf = word_occ;
            sentence_arr.push(tf * idf);
        }
        tf_idf[word] = [...sentence_arr];
    }

    return tf_idf;
}

const get_saliency = (sentence, tf_idf) => {
    let sum = 0;
    let tokenized = tokenize(sentence);
    for (let token of tokenized) {
        if (tf_idf[token]) {
            sum += (
                tf_idf[token].reduce((acc, el) => acc + el, 0) / tokenized.length
            );
        }
    }
    return sum;
}

const tokenize = sentence => {
    return sentence.split(' ').map(el => el.trim());
}

const remove_stopwords = (set) => {
    return set.filter(el => !stopwords_it.includes(el))
}

module.exports = {
    encodings,
    distances,
    get_tf_idf,
    get_saliency
}


// tf idf of what???
