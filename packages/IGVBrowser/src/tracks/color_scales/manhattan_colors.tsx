/**
 * Colors used for coding chromosomes
 * adapted from https://raw.githubusercontent.com/igvteam/igv.js/master/js/gwas/gwasColors.js
 */

const ManhattanColors = {
    X: "rgb(204, 153, 0)",
    Y: "rgb(153, 204, 0)",
    Un: "darkGray)",
    "1": "rgb(80, 80, 255)",
    "2": "rgb(206, 61, 50)",
    "2a": "rgb(210, 65, 55)",
    "2b": "rgb(215, 70, 60)",
    "3": "rgb(116, 155, 88)",
    "4": "rgb(240, 230, 133)",
    "5": "rgb(70, 105, 131)",
    "6": "rgb(186, 99, 56)",
    "7": "rgb(93, 177, 221)",
    "8": "rgb(128, 34, 104)",
    "9": "rgb(107, 215, 107)",
    "10": "rgb(213, 149, 167)",
    "11": "rgb(146, 72, 34)",
    "12": "rgb(131, 123, 141)",
    "13": "rgb(199, 81, 39)",
    "14": "rgb(213, 143, 92)",
    "15": "rgb(122, 101, 165)",
    "16": "rgb(228, 175, 105)",
    "17": "rgb(59, 27, 83)",
    "18": "rgb(205, 222, 183)",
    "19": "rgb(97, 42, 121)",
    "20": "rgb(174, 31, 99)",
    "21": "rgb(231, 199, 111)",
    "22": "rgb(90, 101, 94)",
    "23": "rgb(204, 153, 0)",
    "24": "rgb(153, 204, 0)",
    "25": "rgb(51, 204, 0)",
    "26": "rgb(0, 204, 51)",
    "27": "rgb(0, 204, 153)",
    "28": "rgb(0, 153, 204)",
    "29": "rgb(10, 71, 255)",
    "30": "rgb(71, 117, 255)",
    "31": "rgb(255, 194, 10)",
    "32": "rgb(255, 209, 71)",
    "33": "rgb(153, 0, 51)",
    "34": "rgb(153, 26, 0)",
    "35": "rgb(153, 102, 0)",
    "36": "rgb(128, 153, 0)",
    "37": "rgb(51, 153, 0)",
    "38": "rgb(0, 153, 26)",
    "39": "rgb(0, 153, 102)",
    "40": "rgb(0, 128, 153)",
    "41": "rgb(0, 51, 153)",
    "42": "rgb(26, 0, 153)",
    "43": "rgb(102, 0, 153)",
    "44": "rgb(153, 0, 128)",
    "45": "rgb(214, 0, 71)",
    "46": "rgb(255, 20, 99)",
    "47": "rgb(0, 214, 143)",
    "48": "rgb(20, 255, 177)",
};

//  aliasing
for (const key of Object.keys(ManhattanColors)) {
    const altName: string = "chr" + key;
    //@ts-expect-error: no way to type this
    ManhattanColors[altName] = ManhattanColors[key];
}

// romanizing
for (let a = 1; a <= 48; a++) {
    if (a === 10) continue; // Don't overide "X"
    const roman = romanize(a);
    // @ts-expect-error: no way to type this
    ManhattanColors[roman] = ManhattanColors[a.toString()];
}

function romanize(num: any) {
    if (!+num) return false;
    const digits = String(+num).split("");
    const key = [
        "",
        "C",
        "CC",
        "CCC",
        "CD",
        "D",
        "DC",
        "DCC",
        "DCCC",
        "CM",
        "",
        "X",
        "XX",
        "XXX",
        "XL",
        "L",
        "LX",
        "LXX",
        "LXXX",
        "XC",
        "",
        "I",
        "II",
        "III",
        "IV",
        "V",
        "VI",
        "VII",
        "VIII",
        "IX",
    ];
    let roman = "",
        i = 3;
    //@ts-expect-error: who knows
    while (i--) roman = (key[+digits.pop() + i * 10] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
}

export default ManhattanColors;
