import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dist=path.join(root,'dist');
fs.mkdirSync(dist,{recursive:true});
for(const name of ['index.html','styles.css','app.js','data','assets'])fs.cpSync(path.join(root,name),path.join(dist,name),{recursive:true});
fs.writeFileSync(path.join(dist,'.nojekyll'),'');
// A single-file edition is useful for review and travel without a hosted origin.
let html=fs.readFileSync(path.join(root,'index.html'),'utf8');
html=html.replace(/<link rel="icon"[^>]+>/,'');
html=html.replace(/<link rel="stylesheet" href="([^"]+)">/g,(_,file)=>`<style>\n${fs.readFileSync(path.join(root,file),'utf8')}\n</style>`);
html=html.replace('<script src="assets/vendor/leaflet.js"></script>','<script>window.ICELAND_STANDALONE=true;</script>\n<script src="assets/vendor/leaflet.js"></script>');
html=html.replace(/<script src="([^"]+)"><\/script>/g,(_,file)=>`<script>\n${fs.readFileSync(path.join(root,file),'utf8').replace(/<\/script/gi,'<\\/script')}\n</script>`);
fs.writeFileSync(path.join(root,'iceland-winter-2026.html'),html);
console.log(`Static site: ${dist}`);
console.log(`Standalone: ${path.join(root,'iceland-winter-2026.html')}`);
