import * as fs from "fs";
import { expect, test } from "@jest/globals";
import { XsbConverter } from "../src/converters/xsb";
import { FILEPATH_PREFIX } from "./testutil";

const XSB_FILES = [
    "xsb/1.xsb",
    "xsb/1a.xsb",
    "xsb/1b.xsb",
    "xsb/trailingSpace.xsb",
];

test("wants xsb files", () => {
    const converter = new XsbConverter();

    for (let filepath of XSB_FILES) {
        filepath = FILEPATH_PREFIX + filepath;
        const outputPath = filepath + ".json";

        expect(converter.wantsFile(filepath)).toBeTruthy();
        expect(converter.wantsFile(outputPath)).toBeFalsy();
    }
});

test("can read xsb files", () => {
    const converter = new XsbConverter();

    for (let filepath of XSB_FILES) {
        filepath = FILEPATH_PREFIX + filepath;
        const outputPath = filepath + ".json";

        const level = converter.readFile(filepath);

        const expectedFile = fs.readFileSync(outputPath, "utf-8");
        const expectedLevel = JSON.parse(expectedFile);

        expect(level).toMatchObject(expectedLevel);
    }
});
