import * as fs from "fs";
import { expect, test } from "@jest/globals";
import { SimpleTxtConverter } from "../src/converters/txt";
import { FILEPATH_PREFIX } from "./testutil";

const TXT_FILES = ["txt/1.txt"];

test("wants txt files", () => {
    const converter = new SimpleTxtConverter();

    for (let filepath of TXT_FILES) {
        filepath = FILEPATH_PREFIX + filepath;
        const outputPath = filepath + ".json";

        expect(converter.wantsFile(filepath)).toBeTruthy();
        expect(converter.wantsFile(outputPath)).toBeFalsy();
    }
});

test("can read txt files", () => {
    const converter = new SimpleTxtConverter();

    for (let filepath of TXT_FILES) {
        filepath = FILEPATH_PREFIX + filepath;
        const outputPath = filepath + ".json";

        const level = converter.readFile(filepath, "utf-8");

        const expectedFile = fs.readFileSync(outputPath, "utf-8");
        const expectedLevel = JSON.parse(expectedFile);

        expect(level).toMatchObject(expectedLevel);
    }
});

test("can read alternate encoding txt files", () => {
    const converter = new SimpleTxtConverter();

    const filepath = FILEPATH_PREFIX + "txt/windows1252.txt";
    const outputPath = filepath + ".json";

    const levelBad = converter.readFile(filepath, "utf-8");
    const levelGood = converter.readFile(filepath, "windows-1252");

    const expectedFile = fs.readFileSync(outputPath, "utf-8");
    const expectedLevel = JSON.parse(expectedFile);

    expect(levelBad).not.toMatchObject(expectedLevel);
    expect(levelGood).toMatchObject(expectedLevel);
});
