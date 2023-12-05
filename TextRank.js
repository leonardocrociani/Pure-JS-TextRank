const fs = require('fs');
const { 
    encodings, 
    distances, 
    build_weight_dictonary, 
    get_saliency 
} = require('./utils.js')


class TextRank {
    constructor({
        encoding,
        distance,
        alfa,
        pr_iteration
    }) {
        this.alfa = alfa;
        this.pr_iteration = pr_iteration;
        this.encoding = encodings[encoding];
        this.distance = distances[distance];
        this.graph = null;
        this.sentences = null;
        this.content = null;
    }

    load(input_file) {
        console.log('Loading...');

        const content = fs.readFileSync(input_file, 'utf-8');
        const sentences = content.match( /[^\.!\?]+[\.!\?]+/g );

        if (sentences == null) {
            throw new Error("Can't load input file.");
        }

        console.log('Sentences found', sentences.length, '\n')

        this.sentences = sentences;
        this.content = content;

        this.graph = [];
        for (var i = 0; i < this.sentences.length; i++) {
            this.graph[i] = [];
            for (var j = 0; j < this.sentences.length; j++) {
                this.graph[i][j] = null;
            }
        }

        for (var i = 0; i < this.sentences.length; i++) {
            for (var j = 0; j < this.sentences.length; j++) {
                if (i != j) {
                    this.graph[i][j] = this.distance(
                        this.encoding(this.sentences[i]),
                        this.encoding(this.sentences[j])
                    );
                }
            }
        }

        this.graph = this.normalize_graph(this.graph)

        console.log('Graph successfully loaded (' + this.sentences.length + ' sentences).')

        console.log('Building dictonary...');

        this.tf_idf = build_weight_dictonary(this.sentences, this.content);

        this.sentences = this.sentences
            .map(el => {
                return {
                    sentence: el,
                    saliency: get_saliency(el, this.tf_idf)
                }
            });

        console.log('Dictonary successfully built.')
    }

    summarize(choose_k = () => 5) {
        const ranked = this.apply_page_rank()
        const enriched = ranked.map((el, idx) => { return { el, idx } })
        enriched.sort((a, b) => a.el - b.el);
        const indexes = enriched.splice(0, choose_k(this.sentences)).map(el => el.idx);
        console.log(indexes);
        indexes.sort();
        const sentences = [];
        for (const index of indexes) {
            sentences.push(this.sentences[index].sentence)
        }
        return sentences.join('\n');
    }

    apply_page_rank() {
        let r = [];

        for (var i = 0; i < this.sentences.length; i++) {
            r.push(this.sentences[i]["saliency"]);
        }

        const get_incoming_nodes_sum = (prev_vec, idx) => { // idx nodo
            let s = 0;
            for (var i = 0; i < prev_vec.length; i++) {
                if (i != idx) {
                    s += (
                        prev_vec[i] * this.graph[idx][i] /
                        (prev_vec.length - 1)
                    );
                }
            }
            return s;
        }

        const step = prev_vec => {
            const new_vec = [];
            for (let i = 0; i < prev_vec.length; i++) {
                new_vec[i] = (
                    (this.alfa * get_incoming_nodes_sum(prev_vec, i))
                    +
                    ((1 - this.alfa) * (1 / this.sentences.length))
                )
            }
            return new_vec;
        }

        for (var i = 0; i < this.pr_iteration; i++) {
            r = step(r);
        }

        return r;
    }

    normalize_graph(graph) {
        for (let i = 0; i < graph.length; i++) {
            let sum = graph[i].reduce((acc, val) => acc + val, 0);
            if (sum != 0) {
                graph[i] = graph[i].map(weight => weight / sum);
            }
        }
        return graph;
    }
}

module.exports = TextRank;
