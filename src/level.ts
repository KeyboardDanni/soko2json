const MAX_WIDTH = 30;
const MAX_HEIGHT = 20;

export class Level {
    name: string | null = null;
    author: string | null = null;
    description: string | null = null;
    tiles: string[] = [];
    _collection: string | null = null;
}

export class LevelCollection {
    name: string = "";
    author: string = "";
    description: string = "";
    saveId: string = "";
    levels: Level[] = [];

    verifyAndAddLevel(level: Level) {
        if (level._collection) {
            if (this.name.length <= 0) {
                this.name = level._collection;
                this.saveId = this.name;
            } else if (this.name !== level._collection) {
                console.warn(
                    `Warning: Level ${
                        this.levels.length + 1
                    } belongs to a different collection`
                );
            }
        }
        if (level.author) {
            if (this.author.length <= 0) {
                this.author = level.author;
            } else if (this.author !== level.author) {
                this.author = "Various Authors";
            }
        }

        let width = 0;
        for (const row of level.tiles) {
            width = Math.max(width, row.length);
        }

        if (width > MAX_WIDTH) {
            console.warn(
                `Warning: Level ${
                    this.levels.length + 1
                } is too wide (${width} > ${MAX_WIDTH})`
            );
        }
        if (level.tiles.length > MAX_HEIGHT) {
            console.warn(
                `Warning: Level ${this.levels.length + 1} is too tall (${
                    level.tiles.length
                } > ${MAX_HEIGHT})`
            );
        }

        this.levels.push(level);
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function stripConverterMeta(key: string, value: any) {
    if (key.startsWith("_")) {
        return undefined;
    }

    return value;
}
