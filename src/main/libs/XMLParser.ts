
import {Parser, defaults} from 'xml2js';
import { Flow } from '../models/Flow';

export class XMLParser{
    private parser : Parser;
    constructor(){
        this.parser = new Parser(defaults["0.2"]);
    }
    public execute(xml): Promise<{ Flow : Flow }>{
        return new Promise<{ Flow : Flow }>((resolve, reject) => {
            this.parser.parseString(xml, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
}
