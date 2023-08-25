#! /usr/bin/env node

import { Command } from "commander";
import * as fs from "fs";

function readFile(path: string) {

}

async function readDirectory(path: string) {
    const dir = await fs.promises.opendir(path);

    for await (const dirent of dir) {
        if (dirent.isDirectory()) {
            readDirectory(dirent.path);
        }
        else {
            readFile(dirent.path);
        }
    }
}

function startConversion(source: string) {
    fs.stat(source, (err, stats) => {
        if (err) {
            console.error(`${err.name}: ${err.message}`);
            process.exit(1);
        }

        if (stats.isDirectory()) {
            readDirectory(source);
        }
        else {
            readFile(source);
        }
    });
}

function main() {
    const command = new Command();

    command.argument("<source>", "input file or folder")
        .action((source) => startConversion(source))
        .parse(process.argv);
}

main();
