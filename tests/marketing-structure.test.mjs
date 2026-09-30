import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import vm from 'node:vm';
const require=createRequire(import.meta.url),ts=require('typescript'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
function compile(path,imports){const module={exports:{}};const js=ts.transpileModule(readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2020}}).outputText;vm.runInNewContext(js,{module,exports:module.exports,require:name=>name in imports?imports[name]:require(name),console});return module.exports;}
const site=compile('lib/preview/site.ts',{});
const home=compile('components/marketing/MarketingHome.tsx',{'../../lib/preview/site':site,'next/link':{default:({children,...props})=>React.createElement('a',props,children),__esModule:true}}).default;
const html=renderToStaticMarkup(React.createElement(home));
test('marketing has one focusable skip target and six native FAQ disclosures',()=>{assert.equal((html.match(/Skip to content/g)||[]).length,1);assert.match(html,/id="main-content" tabindex="-1"/);assert.equal((html.match(/<details>/g)||[]).length,6);assert.equal((html.match(/<summary>/g)||[]).length,6);});
test('marketing retains onboarding and same-origin embedded preview routes',()=>{assert.match(html,/href="\/preview\/start"/);assert.match(html,/href="\/preview\/start\?package=first"/);assert.match(html,/src="\/portal-preview\/index.html"/);assert.match(html,/A\$200/);assert.match(html,/A\$1,300/);});
