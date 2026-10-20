const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const actual={window:{}};vm.runInNewContext(fs.readFileSync(__dirname+'/config.js','utf8'),actual);
assert.equal(actual.window.BIBLICAL_STORE.currency,'USD');
assert.equal(actual.window.BIBLICAL_STORE.price,19.90);
assert.equal(actual.window.BIBLICAL_STORE.plans.premium.price,19.90);
assert.equal(actual.window.BIBLICAL_STORE.plans.basic.price,9.90);
assert.equal(actual.window.BIBLICAL_STORE.plans.premiumSpecial.price,15.90);
class Element{
 constructor(){this.nodes=new Map();this.events={};this.children=[];this.style={};this.classList={add(){}};this.hidden=false;this.open=false;}
 querySelector(selector){if(!this.nodes.has(selector))this.nodes.set(selector,new Element());return this.nodes.get(selector);}
 append(...nodes){this.children.push(...nodes);}prepend(node){this.children.unshift(node);}before(){}setAttribute(){}
 addEventListener(type,fn){this.events[type]=fn;}showModal(){this.open=true;}close(){this.open=false;this.events.close?.();}focus(){this.focused=true;}
}
function configuration(withUrls){return {currency:'USD',price:19.90,plans:{basic:{price:9.90,checkoutUrl:withUrls?'https://pay.hotmart.com/BASIC':''},premium:{price:19.90,checkoutUrl:withUrls?'https://pay.hotmart.com/PREMIUM':''},premiumSpecial:{price:15.90,checkoutUrl:withUrls?'https://pay.hotmart.com/SPECIAL':''}}};}
for(const withUrls of [false,true]){
 const premium=new Element(),body=new Element(),created=[];
 const context={window:{BIBLICAL_STORE:configuration(withUrls)},document:{body,querySelector:()=>premium,createElement:()=>{const el=new Element();created.push(el);return el;}},Intl,URL};
 vm.runInNewContext(fs.readFileSync(__dirname+'/plans.js','utf8'),context);
 const [grid,basic,dialog]=created;
 assert.equal(premium.querySelector('.price-big').textContent,new Intl.NumberFormat('es-ES',{style:'currency',currency:'USD'}).format(19.90));
 assert.equal(dialog.querySelector('[data-premium-regular]').textContent,new Intl.NumberFormat('es-ES',{style:'currency',currency:'USD'}).format(19.90));
 assert.equal(grid.children[0],basic);assert.equal(grid.children[1],premium);
 assert.equal(basic.querySelector('[data-basic-price]').textContent,'9,90 US$');
 assert.equal(dialog.querySelector('[data-premium-special]').textContent,'15,90 US$');
 assert.equal(premium.querySelector('[data-mb-buy]').href,withUrls?'https://pay.hotmart.com/PREMIUM':'checkout.html?plan=premium');
 assert.equal(dialog.querySelector('[data-accept-upgrade]').href,withUrls?'https://pay.hotmart.com/SPECIAL':'checkout.html?plan=premiumSpecial');
 assert.equal(dialog.querySelector('[data-continue-basic]').href,withUrls?'https://pay.hotmart.com/BASIC':'checkout.html?plan=basic');
 basic.querySelector('.basic-plan-buy').events.click();assert.equal(dialog.open,true);assert.equal(body.style.overflow,'hidden');
 dialog.querySelector('.upgrade-close').events.click();assert.equal(dialog.open,false);assert.equal(body.style.overflow,'');assert.equal(basic.querySelector('.basic-plan-buy').focused,true);
}
for(const plan of ['basic','premium','premiumSpecial','invalid']){
 const config=configuration(true),body=new Element(),nodes=new Map();let redirected;
 const document={getElementById:id=>{if(!nodes.has(id))nodes.set(id,new Element());return nodes.get(id);},querySelector:selector=>body.querySelector(selector),createElement:()=>new Element()};
 const context={window:{BIBLICAL_STORE:config},document,Intl,URL,URLSearchParams,location:{search:'?plan='+plan,assign:url=>redirected=url}};
 vm.runInNewContext(fs.readFileSync(__dirname+'/checkout.js','utf8'),context);
 const valid=plan==='invalid'?'premium':plan;
 assert.equal(document.getElementById('price').textContent,new Intl.NumberFormat('es-ES',{style:'currency',currency:'USD'}).format(config.plans[valid].price));
 document.getElementById('pay').events.click();assert.equal(redirected,config.plans[valid].checkoutUrl);
 if(plan==='basic')assert.ok(!body.querySelector('aside ul').innerHTML.includes('explorador'));
}
console.log('Plans verified: basic US$9.90; premium US$19.90; upgrade US$15.90; dialog opening/closing; basic decline; three separate payment routes; correct checkout totals.');
