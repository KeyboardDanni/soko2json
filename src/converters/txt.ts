import * as fs from "fs";
import { Converter } from "../converter";
import { Level } from "../level";

const VALID_TILE_LETTERS = "#@+$*. -_";

export class SimpleTxtConverter implements Converter {
    readonly name = "Simple TXT file";

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
        return path.toLocaleLowerCase().endsWith(".txt");
    }
    readFile(path: string, encoding: string): Level[] {
        const levels = [];
        let level = new Level();
        const fileBuffer = fs.readFileSync(path);
        const file = new TextDecoder(encoding).decode(fileBuffer);
        const lines = file.split(/\r?\n/);

        for (const line of lines) {
            if (this.isValidTileRow(line)) {
                const transformed = line.replaceAll(/-|_/g, " ");
                level.tiles.push(transformed);
            } else {
                if (level.tiles.length > 0) {
                    levels.push(level);
                    level = new Level();
                }

                if (line.startsWith(";")) {
                    const name = line.slice(1).trim();

                    const startQuote = name.indexOf("'");
                    const endQuote = name.lastIndexOf("'");

                    if (startQuote !== -1 && endQuote !== -1) {
                        level.name = name.slice(startQuote + 1, endQuote);
                    }
                }
            }
        }

        if (level.tiles.length > 0) {
            levels.push(level);
        }

        return levels;
    }
}
