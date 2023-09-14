import { Level } from "./level";

export interface Converter {
    readonly name: string;

    wantsFile(path: string): boolean;
    readFile(path: string, encoding: string): Level[];
}
