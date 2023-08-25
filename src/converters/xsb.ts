import { Converter } from "../converter";
import { Level } from "../level";

export class XsbConverter implements Converter {
    readonly name = "sokoban.de XSB";

    wantsFile(path: string): boolean {
        return path.toLocaleLowerCase().endsWith(".xsb");
    }
    readFile(_path: string): Level {
        throw new Error("Method not implemented.");
    }
}
