import fs from 'fs';
import p from "path-browserify";

interface LoadResult {
    [key: string]: string;
}

export function loadFlows(input: string | string[]): Promise<LoadResult> {
    return new Promise<LoadResult>((resolve, reject) => {
        let files: string[];

        if (typeof input === 'string') {
            const absolutePath = p.resolve(process.cwd(), input);
            // If input is a directory
            fs.readdir(absolutePath, (err, fileList) => {
                if (err) {
                    reject(err);
                    return;
                }
                files = fileList.map(file => p.join(absolutePath, file));
                readAll(files).then(resolve).catch(reject);
            });
        } else {
            // If input is a list of files
            files = input.map(filePath => p.resolve(process.cwd(), filePath));
            readAll(files).then(resolve).catch(reject);
        }

        function readAll(files: string[]): Promise<LoadResult> {
            const promises: Promise<[string, string]>[] = files.map(file => {
                return new Promise<[string, string]>((resolveFile, rejectFile) => {
                    fs.readFile(file, 'utf8', (err, data) => {
                        if (err) {
                            rejectFile(err);
                        } else {
                            resolveFile([file, data]);
                        }
                    });
                });
            });
            return Promise.all(promises).then(results => {
                const resultObj: LoadResult = {};
                results.forEach(([file, data]) => {
                    resultObj[file] = data;
                });
                return resultObj;
            });
        }
    });
}
