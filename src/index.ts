#! /usr/bin/env node

import { Command } from "commander";
import { Reader } from "./reader";
import { XsbConverter } from "./converters/xsb";

function main() {
    let status = 1;
    const reader = new Reader();
    const command = new Command();

    reader.converters.push(new XsbConverter());

    let convertersList = "";

    for (const converter of reader.converters) {
        convertersList += converter.name + "\n";
    }

    convertersList = convertersList.trimEnd();

    command
        .name("soko2json")
        .description(
            `Converts Sokoban files into the JSON format used by Super Crate Hoard.\n\nAvailable converters:\n ${convertersList}`
        )
        .argument("<source>", "input file or folder")
        .action((source) => {
            status = reader.startConversion(source) ? 0 : 1;
        })
        .parse(process.argv);

    return status;
}

main();
