import { assert, expect } from 'chai';
import 'mocha';
import * as core from '../src'

describe('Parse ', () => {
  let flow: core.Flow;

  it(' should parse Flows when passed a folder uri', async () => {

    let folderURI = './tests/xmlfiles';
    const flows: core.Flow[] = await core.parse(folderURI);
    expect(flows.length).to.equal(2);
    const results = core.scan(flows);
    expect(results.length).to.equal(2);
  });


  it(' should parse Flows when passed a list of flow uris ', async () => {

    let files = ['./tests/xmlfiles/Unused_Variable_Fixed.flow-meta.xml'];
    const flows: core.Flow[] = await core.parse(files);
    expect(flows.length).to.equal(1);
    const results = core.scan(flows);
    expect(results.length).to.equal(1);
  });
});
