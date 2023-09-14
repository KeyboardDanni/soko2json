import * as fs from "fs";
import { Level, LevelCollection, stripConverterMeta } from "./level";
import { Converter } from "./converter";

export class ReaderError extends Error {
    name = "ReaderError";
}

export interface ConversionOptions {
    converter: string;
    encoding: string;
}

export class Reader {
    converters: Converter[] = [];

    readFile(path: string, options: ConversionOptions) {
        for (const converter of this.converters) {
            if (
                (options.converter.length <= 0 && converter.wantsFile(path)) ||
                options.converter.toLocaleLowerCase() ===
                    converter.name.toLocaleLowerCase()
            ) {
                return converter.readFile(path, options.encoding);
            }
        }

        throw new ReaderError(`No converter found for "${path}"`);
    }

    readSubdirectory(path: string, options: ConversionOptions) {
        let levels: Level[] = [];

        const items = fs.readdirSync(path);
        items.sort((a, b) => a.localeCompare(b));

        for (const item of items) {
            const itemPath = path + "/" + item;

            const stats = fs.statSync(itemPath);

            if (stats.isDirectory()) {
                levels = levels.concat(
                    this.readSubdirectory(itemPath, options)
                );
            } else {
                levels = levels.concat(this.readFile(itemPath, options));
            }
        }

        return levels;
    }

    readDirectory(path: string, options: ConversionOptions) {
        const collection = new LevelCollection();

        const levels = this.readSubdirectory(path, options);

        for (const level of levels) {
            collection.verifyAndAddLevel(level);
        }

        return collection;
    }

    startConversion(source: string, options: ConversionOptions): boolean {
        try {
            if (options.converter === "auto") {
                options.converter = "";
            }

            const stats = fs.statSync(source);
            let output;

            if (stats.isDirectory()) {
                const collection = this.readDirectory(source, options);
                output = JSON.stringify(collection, stripConverterMeta, "    ");
            } else {
                const levels = this.readFile(source, options);
                output = JSON.stringify(levels, stripConverterMeta, "    ");
            }

            process.stdout.write(output);
        } catch (err) {
            if (err instanceof ReaderError) {
                console.error(`${err.name}: ${err.message}`);
                return false;
            } else if (err instanceof Error) {
                if ("path" in err) {
                    console.error(`${err.name}: ${err.message}`);
                    return false;
                }
            }

            throw err;
        }

        return true;
    }
}
