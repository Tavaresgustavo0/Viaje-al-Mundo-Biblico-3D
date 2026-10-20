(() => {
 const config=window.BIBLICAL_STORE;
 const offer=config.promotion;
 const selected=new URLSearchParams(location.search||'').get('plan');
 const plan=['basic','premium','premiumSpecial'].includes(selected)?selected:'premium';
 const chosen=config.plans?.[plan]||{price:config.price,checkoutUrl:config.checkoutUrl};
 document.getElementById('price').textContent=new Intl.NumberFormat('es-ES',{style:'currency',currency:config.currency}).format(chosen.price);
 if(config.plans){
   document.querySelector('aside h2').textContent=plan==='basic'?'Plan Básico · Ebook principal':plan==='premiumSpecial'?'Plan Premium · Tu descuento especial':'Plan Premium · Colección completa';
   document.querySelector('aside ul').innerHTML=plan==='basic'?'<li>Ebook principal: Viaje al Mundo Bíblico</li><li>Formato digital para tus dispositivos</li><li>Acceso permanente al ebook</li>':'<li>Ebook principal Viaje al Mundo Bíblico</li><li>Los seis volúmenes complementarios</li><li>Explorador interactivo con mapas y escenas en vídeo</li><li>Kit de bienvenida y recursos de estudio</li>';
 }
 let destination;
 try {if(chosen.checkoutUrl){destination=new URL(chosen.checkoutUrl);if(destination.protocol!=='https:')destination=null;}}catch{}
 if(destination && !(offer&&!offer.demo&&offer.remaining===0)){
   const button=document.getElementById('pay');button.hidden=false;
   document.getElementById('status').hidden=true;
   button.addEventListener('click',()=>{location.assign(destination.href);});
 }
 for(const [label,url] of [['Contacto',config.supportEmail?'mailto:'+config.supportEmail:''],['Condiciones de compra',config.termsUrl],['Política de privacidad',config.privacyUrl]]){
   if(!url)continue;const a=document.createElement('a');a.textContent=label;a.href=url;document.getElementById('links').append(a);
 }
})();
