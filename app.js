const START = 'start';
const MIDDLE = 'middle';
const END = 'end';

const isTerminal = (symbol) => {
    return !/[A-Z]/g.test(symbol);
}


// Tabela final - inicio --- esta pronto


const q1 = {
    S: [['a', 'B'], ['d']],
    B: [['c', 'D', 'b'], ['empty']],
    D: [['a'], ['empty']]
};

const q2 = {
    Z: [['X', 'Y', 'Z'], ['d']],
    Y: [['c'], ['empty']],
    X: [['Y'], ['a']]
};

const q3 = {
    S: [['(', 'A', ')'], ['b']],
    A: [['B', ':', 'A'], ['B']],
    B: [['a'], ['empty']]
};
const q4 = {
    S: [['(', 'A', ')'], ['b']],
    A: [['B', 'X']],
    X: [[';', 'B', 'X'], ['empty']],
    B: [['a'], ['empty']]
}
const q5 = {
    E: [['T', 'EL'],],
    EL: [['+', 'T', 'EL'], ['empty']],
    T: [['F', 'TL']],
    TL: [['*', 'F', 'TL'], ['empty']],
    F: [['(', 'E', ')'], ['id']],
    //         X: [['a']]
}

tabelaPreditivaTabular = {
    'E': {
        'a': ['T', 'EL'],
    },
    'EL': {
        '+': ['+', 'T', 'EL'],
        '$': ['empty'],
    },
    'T': {
        'a': ['a'],
    }
}

escreverTabelafinal = (tabelaFinal) => {

    let tamanho = tabelaFinal.pilha.length;

    console.log("pilha \t\t", "entrada \t\t");

    for (let index = 0; index < tamanho; index++) {
        console.log("Linha: ", index);
        console.log("Pilha: ", JSON.stringify(tabelaFinal.pilha[index]));
        console.log("Entrada: ", JSON.stringify(tabelaFinal.entrada[index]));
        console.log("Saída: ", JSON.stringify(tabelaFinal.saida[index]));
        console.log("\n");

    }
}


verificarSentenca = (pilha, entrada, tabelaPreditivaTabular) => {
    let tabelaFinal = {
        pilha: [],
        entrada: [],
        saida: []
    }

    tabelaFinal.pilha.push([...pilha]);
    tabelaFinal.entrada.push([...entrada]);
    tabelaFinal.saida.push([]);

    let encontrouNaTabela = true;

    while (encontrouNaTabela) {
        encontrouNaTabela = false;

        let letraEntrada = entrada.shift();
        let topoPilha = pilha.pop();

        if (letraEntrada === topoPilha && letraEntrada !== '$') {
            tabelaFinal.pilha.push([...pilha]);
            tabelaFinal.entrada.push([...entrada]);
            tabelaFinal.saida.push([]);
            encontrouNaTabela = true;
        } else {
            // Percore as nao terminais
            for (const naoTerminalTabela in tabelaPreditivaTabular) {
                if (topoPilha === naoTerminalTabela) {
                    for (const letraTabela in tabelaPreditivaTabular[topoPilha]) {
                        if (letraEntrada === letraTabela) {
                            entrada.unshift(letraEntrada);
                            let tabelaPreditivaTabularTmp = [...tabelaPreditivaTabular[topoPilha][letraEntrada]];
                            pilha.push(...tabelaPreditivaTabularTmp.reverse());
                            pilha = pilha.filter(e => e !== 'empty');
                            tabelaFinal.pilha.push([...pilha]);
                            tabelaFinal.entrada.push([...entrada]);

                            let sentenca = {};
                            sentenca[topoPilha] = [...tabelaPreditivaTabularTmp];

                            tabelaFinal.saida.push(sentenca);
                            encontrouNaTabela = true;
                        }
                    }
                }
            }
        }
    }
    escreverTabelafinal(tabelaFinal);
}

verificarSentenca(["$", "E"], ["a", "+", "a", "+", "a", "$"], tabelaPreditivaTabular);

// Tabela final - final ----


// follow ---------------------------------------------------- Não esta pronto
const getaBb = (symbol) => {

    const aBb = {
    }

    let state = START;

    let letterArray = symbol.split("");


    letterArray.forEach(letter => {
        if (letter === letter.toLowerCase()) {
            if (state === MIDDLE) {
                state = END;
            }
            aBb[state] += letter;
        }
        else {
            state = MIDDLE;
            aBb[state] += letter;
        }

    });

    return aBb;
}



const follow = (symbols, termial) => {
    const aBb = getaBb(symbols);

    if (isTerminal(symbols)) {
        // Adicionar terminal na lista
        return {
            termial: symbols
        }
    }

    if (aBb[START] && aBb[MIDDLE] && aBb[END] === undefined) {
        // Adicionar Follow de aBb[MIDDLE] na lista 
        return {
            follow: aBb[MIDDLE]
        }
    }

    if (aBb[END] && aBb[MIDDLE] === termial) {
        // Adicionar terminal na lista
        return {
            termial: aBb[END]
        }
    }

    if (!isTerminal(aBb[START]) && !isTerminal(aBb[MIDDLE])) {
        return {
            first: aBb[START]
        }
    }

    return undefined;
}



const getFollows = (jsonInput) => {

    let follows = {};
    let first = true;
    let result = undefined;

    for (const key in jsonInput) {
        const prod = jsonInput[key];

        follows[key] = [];

        if (first) {
            follows[key].push('$');
            first = false;
        } else {
            result = follow(prod, key);
            if (result) {
                follows[key].push(result);
            }
        }
    }

    return follows;
}
// follow ----------------------------------------------------



(function () {
    const q1 = {
        S: [['a', 'B'], ['d']],
        B: [['c', 'D', 'b'], ['empty']],
        D: [['a'], ['empty']]
    };

    const q2 = {
        Z: [['X', 'Y', 'Z'], ['d']],
        Y: [['c'], ['empty']],
        X: [['Y'], ['a']]
    };

    const q3 = {
        S: [['(', 'A', ')'], ['b']],
        A: [['B', ':', 'A'], ['B']],
        B: [['a'], ['empty']]
    };
    const q4 = {
        S: [['(', 'A', ')'], ['b']],
        A: [['B', 'X']],
        X: [[';', 'B', 'X'], ['empty']],
        B: [['a'], ['empty']]
    }
    const q5 = {
        E: [['T', 'EL'],],
        EL: [['+', 'T', 'EL'], ['empty']],
        T: [['F', 'TL']],
        TL: [['*', 'F', 'TL'], ['empty']],
        F: [['(', 'E', ')'], ['id']],
        //         X: [['a']]
    }

    const jsonInput = q4;
    const isTerminal = (symbol) => {
        return !/[A-Z]/g.test(symbol);

    }

    const getFirst = (prod) => {
        for (symbol of prod) {
            if (isTerminal(symbol)) {
                return symbol;
            }
            else {
                const firsts = [];
                for (productions of jsonInput[symbol]) {
                    firsts.push(getFirst(productions));
                }
                return firsts;
            }
        }
        //         return firsts;
    }

    const treeToArray = (arr, strArrAccumulator = []) => {
        for (item of arr) {
            if (item instanceof Array) {
                return treeToArray(item, strArrAccumulator)
            }
            else {
                strArrAccumulator.push(item);
            }
        }
        return strArrAccumulator;
    }

    const firsts = {};
    for (const key in jsonInput) {
        const productions = jsonInput[key];

        let currFirsts = [];
        productions.forEach((prod) => {
            const first = getFirst(prod);
            if (first instanceof Array) {
                const treeAsArray = treeToArray(first);
                //                 console.log('treeAsArray', treeAsArray);
                currFirsts = currFirsts.concat(treeAsArray);
                //                 console.log('currFirsts', currFirsts);
            }
            else {
                currFirsts.push(first);
            }
        });
        firsts[key] = currFirsts;
    }

    console.log('firsts', firsts);

})();


