import * as fs from "fs";
import { Level, LevelCollection } from "./level";
import { Converter } from "./converter";

export class ReaderError extends Error {
    name = "ReaderError";
}

export class Reader {
    converters: Converter[] = [];

    readFile(path: string) {
        for (const converter of this.converters) {
            if (converter.wantsFile(path)) {
                return converter.readFile(path);
            }
        }

        throw new ReaderError(`No converter found for "${path}"`);
    }

    readSubdirectory(path: string) {
        const levels: Level[] = [];

        const items = fs.readdirSync(path);
        items.sort((a, b) => a.localeCompare(b));

        for (const item of items) {
            const itemPath = path + "/" + item;

            const stats = fs.statSync(itemPath);

            if (stats.isDirectory()) {
                levels.concat(this.readSubdirectory(itemPath));
            } else {
                levels.push(this.readFile(itemPath));
            }
        }

        return levels;
    }

    readDirectory(path: string) {
        const collection = new LevelCollection();

        collection.levels = this.readSubdirectory(path);

        return collection;
    }

    startConversion(source: string): boolean {
        try {
            const stats = fs.statSync(source);

            if (stats.isDirectory()) {
                const collection = this.readDirectory(source);

                process.stdout.write(JSON.stringify(collection));
            } else {
                const level = this.readFile(source);

                process.stdout.write(JSON.stringify(level));
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
