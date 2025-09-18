import { igv } from "igv/dist/igv.esm";
import { _deepCopy } from "@niagads/common";

const SEQUENCES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];

class ShardedBEDReader {
    config: any;
    genome: string;
    readers: any;

    constructor(config: any, genome: any) {
        this.config = config;
        this.genome = genome;

        const readers: any = {};

        SEQUENCES.forEach(function (chrN: number) {
            const queryChr: string = genome
                ? genome.getChromosomeName(`chr${chrN.toString()}`)
                : `chr${chrN.toString()}`;
            readers[queryChr] = getReader(config, genome, queryChr);
        });

        this.readers = readers;
    }

    async readFeatures(chr: string, start: number, end: number) {
        if (chr in this.readers) {
            const reader = this.readers[chr];
            const features = await reader.readFeatures(chr, start, end);
            return features;
        }
        return []; // X,Y, M
    }
}

function getReader(config: any, genome: any, chr: string) {
    const shardConfig = _deepCopy(config);
    if (config.decode) {
        shardConfig.decode = config.decode; // deep copy loses functions as it is a json transformation
    }
    shardConfig.url = config.url.replace("$CHR", chr);

    if (config.indexURL) {
        shardConfig.indexURL = config.indexURL.replace("$CHR", chr);
    }

    return new igv.FeatureFileReader(shardConfig, genome);
}

export default ShardedBEDReader;
