import * as fs from "fs";
import { Level, LevelCollection, stripConverterMeta } from "./level";
import { Converter } from "./converter";

export class ReaderError extends Error {
    name = "ReaderError";
}

export class Reader {
    converters: Converter[] = [];

    readFile(path: string, encoding: string) {
        for (const converter of this.converters) {
            if (converter.wantsFile(path)) {
                return converter.readFile(path, encoding);
            }
        }

        throw new ReaderError(`No converter found for "${path}"`);
    }

    readSubdirectory(path: string, encoding: string) {
        const levels: Level[] = [];

        const items = fs.readdirSync(path);
        items.sort((a, b) => a.localeCompare(b));

        for (const item of items) {
            const itemPath = path + "/" + item;

            const stats = fs.statSync(itemPath);

            if (stats.isDirectory()) {
                levels.concat(this.readSubdirectory(itemPath, encoding));
            } else {
                levels.push(this.readFile(itemPath, encoding));
            }
        }

        return levels;
    }

    readDirectory(path: string, encoding: string) {
        const collection = new LevelCollection();

        const levels = this.readSubdirectory(path, encoding);

        for (const level of levels) {
            collection.verifyAndAddLevel(level);
        }

        return collection;
    }

    startConversion(source: string, encoding: string = "utf-8"): boolean {
        try {
            const stats = fs.statSync(source);

            if (stats.isDirectory()) {
                const collection = this.readDirectory(source, encoding);

                process.stdout.write(
                    JSON.stringify(collection, stripConverterMeta, "    ")
                );
            } else {
                const level = this.readFile(source, encoding);

                process.stdout.write(
                    JSON.stringify(level, stripConverterMeta, "    ")
                );
            }
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
