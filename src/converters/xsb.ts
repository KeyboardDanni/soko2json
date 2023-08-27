import * as fs from "fs";
import { Converter } from "../converter";
import { Level } from "../level";

const VALID_TILE_LETTERS = "#@+$*. -_";
const FIELD_TITLE = "Title:";
const FIELD_AUTHOR = "Author:";
const FIELD_COLLECTION = "Collection:";

export class XsbConverter implements Converter {
    readonly name = "XSB file";

    isValidTileRow(row: string) {
        if (row.length <= 0) {
            return false;
        }

        for (const letter of row) {
            if (!VALID_TILE_LETTERS.includes(letter)) {
                return false;
            }
        }

        return true;
    }

    wantsFile(path: string): boolean {
        return path.toLocaleLowerCase().endsWith(".xsb");
    }

    readFile(path: string): Level {
        const level = new Level();
        const file = fs.readFileSync(path, "utf-8");
        const lines = file.split(/\r?\n/);

        let readingTiles = true;

        for (const line of lines) {
            if (readingTiles && this.isValidTileRow(line)) {
                const transformed = line.replace(/-|_/, " ");
                level.tiles.push(transformed);
            }

            if (line.startsWith(FIELD_TITLE)) {
                level.name = line.substring(FIELD_TITLE.length).trim();
                readingTiles = false;
            }
            if (line.startsWith(FIELD_AUTHOR)) {
                level.author = line.substring(FIELD_AUTHOR.length).trim();
                readingTiles = false;
            }
            if (line.startsWith(FIELD_COLLECTION)) {
                level._collection = line
                    .substring(FIELD_COLLECTION.length)
                    .trim();
                readingTiles = false;
            }
        }

        return level;
    }
}
