
;
document.querySelectorAll('#preview-dots,#uso-dots').forEach(function(el){el.replaceChildren()});

/* ── Acordeón de la FAQ ── */
function openFaq(btn){
  var item=btn.closest('.faq-item'),open=item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(function(el){el.classList.remove('open')});
  if(!open)item.classList.add('open');
  document.querySelectorAll('.faq-btn').forEach(function(b){b.setAttribute('aria-expanded', String(b.closest('.faq-item').classList.contains('open')))});
}
/* ── Video de la app: reproduce solo cuando está a la vista ── */
(function(){
  var video=document.getElementById('mb-app-demo-video');
  if(!video)return;
  video.muted=true; video.defaultMuted=true;
  // On phones, let visitors choose when to spend data and play the demo.
  if(window.matchMedia('(max-width:760px), (prefers-reduced-motion: reduce)').matches || navigator.connection?.saveData){
    video.controls=true;video.removeAttribute('tabindex');video.style.pointerEvents='auto';
    return;
  }
  var isInView=false;
  function pauseVideo(){ if(!video.paused)video.pause(); }
  function playVideo(){
    if(document.hidden)return;
    var attempt=video.play();
    if(attempt&&typeof attempt.catch==='function')attempt.catch(function(){});
  }
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        isInView=entry.isIntersecting&&entry.intersectionRatio>=0.4;
        if(isInView)playVideo(); else pauseVideo();
      });
    },{threshold:[0,0.4,0.75]}).observe(video);
  }else{ playVideo(); }
  document.addEventListener('visibilitychange',function(){
    if(document.hidden)pauseVideo(); else if(isInView)playVideo();
  });
})();
/* ── Carrusel "Así se usa" ── */
(function(){
  var track=document.getElementById('uso-track');
  var prev=document.getElementById('uso-prev');
  var next=document.getElementById('uso-next');
  var dotsWrap=document.getElementById('uso-dots');
  if(!track||!prev||!next)return;
  var slides=[].slice.call(track.querySelectorAll('.uso-slide'));
  if(!slides.length)return;
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce), (max-width:760px)').matches;
  var timer=null, resume=null, inView=false, current=0;
  function paso(){
    var a=slides[0].getBoundingClientRect();
    if(slides.length>1){ var b=slides[1].getBoundingClientRect(); return Math.round(b.left-a.left); }
    return Math.round(a.width);
  }
  function indiceActual(){ var p=paso(); return p?Math.round(track.scrollLeft/p):0; }
  function alFinal(){ return track.scrollLeft+track.clientWidth>=track.scrollWidth-4; }
  function irA(i,suave){ var p=paso(); track.scrollTo({left:i*p,behavior:(suave&&!reduce)?'smooth':'auto'}); }
  function avanzar(){ if(alFinal())irA(0,true); else irA(indiceActual()+1,true); }
  function retroceder(){ if(track.scrollLeft<=4)irA(slides.length-1,true); else irA(indiceActual()-1,true); }
  var dots=[];
  if(dotsWrap){
    slides.forEach(function(_,i){
      var d=document.createElement('button');
      d.type='button';
      d.className='uso-dot'+(i===0?' is-active':'');
      d.setAttribute('aria-label','Mostrar imagen '+(i+1));
      d.addEventListener('click',function(){pausar();irA(i,true)});
      dotsWrap.appendChild(d); dots.push(d);
    });
  }
  function pintarDots(){
    var i=indiceActual(); if(i===current)return; current=i;
    dots.forEach(function(d,n){d.classList.toggle('is-active',n===i)});
  }
  function arrancar(){
    if(reduce||timer||!inView)return;
    timer=setInterval(function(){ if(document.hidden)return; avanzar(); },4000);
  }
  function detener(){ if(timer){clearInterval(timer);timer=null} }
  function pausar(){ detener(); if(resume)clearTimeout(resume); resume=setTimeout(arrancar,9000); }
  prev.addEventListener('click',function(){pausar();retroceder()});
  next.addEventListener('click',function(){pausar();avanzar()});
  track.addEventListener('pointerdown',pausar);
  track.addEventListener('touchstart',pausar,{passive:true});
  track.addEventListener('wheel',pausar,{passive:true});
  track.addEventListener('mouseenter',detener);
  track.addEventListener('mouseleave',arrancar);
  var raf=null;
  track.addEventListener('scroll',function(){
    if(raf)return; raf=setTimeout(function(){raf=null;pintarDots()},120);
  },{passive:true});
  document.addEventListener('visibilitychange',function(){
    if(document.hidden)detener(); else if(inView)arrancar();
  });
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(entradas){
      entradas.forEach(function(e){
        inView=e.isIntersecting&&e.intersectionRatio>=0.3;
        if(inView)arrancar(); else detener();
      });
    },{threshold:[0,0.3,0.6]}).observe(track);
  }else{ inView=true; arrancar(); }
})();
/* ══ CONTADORES ANIMADOS — 300 / 100 / 9 / 7 ══ */
(function(){
  var nums=[].slice.call(document.querySelectorAll('.counter-num'));
  if(!nums.length)return;
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce), (max-width:760px)').matches;
  function animate(el){
    if(el.dataset.done==='1')return;
    el.dataset.done='1';
    var target=parseInt(el.getAttribute('data-target')||'0',10);
    var suffix=el.getAttribute('data-suffix')||'';
    if(reduce){el.textContent=target+suffix;return;}
    var start=performance.now(),duration=1150;
    function frame(now){
      var p=Math.min(1,(now-start)/duration);
      var eased=1-Math.pow(1-p,3);
      el.textContent=Math.floor(target*eased)+suffix;
      if(p<1)requestAnimationFrame(frame); else el.textContent=target+suffix;
    }
    requestAnimationFrame(frame);
  }
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){if(e.isIntersecting){animate(e.target);io.unobserve(e.target);}});
    },{threshold:.55});
    nums.forEach(function(n){io.observe(n)});
  }else{nums.forEach(animate)}
})();

/* ══ CARRUSEL GRANDE DE PÁGINAS — autoplay + flechas + swipe ══ */
(function(){
  var viewport=document.getElementById('preview-viewport');
  var track=document.getElementById('preview-track');
  var slides=track ? [].slice.call(track.querySelectorAll('.preview-slide')) : [];
  var prev=document.getElementById('preview-prev');
  var next=document.getElementById('preview-next');
  var dotsWrap=document.getElementById('preview-dots');
  var stage=document.getElementById('preview-stage');

  if(!viewport||!track||!slides.length||!prev||!next||!dotsWrap||!stage)return;

  var reduce=window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce), (max-width:760px)').matches;

  var current=0;
  var timer=null;
  var resumeTimer=null;
  var settleTimer=null;
  var inView=false;
  var dots=[];

  slides.forEach(function(_,i){
    var d=document.createElement('button');
    d.type='button';
    d.className='preview-dot'+(i===0?' is-active':'');
    d.setAttribute('aria-label','Mostrar página '+(i+1));
    d.addEventListener('click',function(){
      pauseAuto(5500);
      go(i,true);
    });
    dotsWrap.appendChild(d);
    dots.push(d);
  });

  function normalizedIndex(i){
    return (i + slides.length) % slides.length;
  }

  function targetScrollLeft(i){
    var slide=slides[i];
    var viewportRect=viewport.getBoundingClientRect();
    var slideRect=slide.getBoundingClientRect();

    return viewport.scrollLeft
      + (slideRect.left - viewportRect.left)
      - (viewport.clientWidth - slideRect.width)/2;
  }

  function paint(){
    slides.forEach(function(s,i){
      var distance=Math.abs(i-current);
      s.classList.toggle('is-active',i===current);
      s.classList.toggle('is-near',distance===1 || distance===slides.length-1);
    });

    dots.forEach(function(d,i){
      d.classList.toggle('is-active',i===current);
    });
  }

  function go(i,smooth){
    current=normalizedIndex(i);

    viewport.scrollTo({
      left:Math.max(0,targetScrollLeft(current)),
      behavior:(smooth&&!reduce)?'smooth':'auto'
    });

    paint();
  }

  function nearestIndex(){
    var viewportRect=viewport.getBoundingClientRect();
    var viewportCenter=viewportRect.left+viewport.clientWidth/2;
    var best=0;
    var bestDistance=Infinity;

    slides.forEach(function(slide,i){
      var r=slide.getBoundingClientRect();
      var c=r.left+r.width/2;
      var distance=Math.abs(c-viewportCenter);

      if(distance<bestDistance){
        bestDistance=distance;
        best=i;
      }
    });

    return best;
  }

  function stopAuto(){
    if(timer){
      clearInterval(timer);
      timer=null;
    }
  }

  function startAuto(){
    if(reduce||timer||!inView||document.hidden)return;

    timer=setInterval(function(){
      go(current+1,true);
    },3600);
  }

  function pauseAuto(delay){
    stopAuto();

    if(resumeTimer)clearTimeout(resumeTimer);

    resumeTimer=setTimeout(function(){
      startAuto();
    },delay||5000);
  }

  prev.addEventListener('click',function(e){
    e.preventDefault();
    e.stopPropagation();
    pauseAuto(5000);
    go(current-1,true);
  });

  next.addEventListener('click',function(e){
    e.preventDefault();
    e.stopPropagation();
    pauseAuto(5000);
    go(current+1,true);
  });

  viewport.addEventListener('pointerdown',function(){
    pauseAuto(6000);
  });

  viewport.addEventListener('touchstart',function(){
    pauseAuto(6000);
  },{passive:true});

  viewport.addEventListener('wheel',function(){
    pauseAuto(6000);
  },{passive:true});

  viewport.addEventListener('scroll',function(){
    if(settleTimer)clearTimeout(settleTimer);

    settleTimer=setTimeout(function(){
      var n=nearestIndex();

      if(n!==current){
        current=n;
        paint();
      }
    },100);
  },{passive:true});

  document.addEventListener('visibilitychange',function(){
    if(document.hidden){
      stopAuto();
    }else{
      startAuto();
    }
  });

  window.addEventListener('resize',function(){
    setTimeout(function(){
      go(current,false);
    },80);
  });

  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        inView=entry.isIntersecting && entry.intersectionRatio>=0.18;

        if(inView){
          startAuto();
        }else{
          stopAuto();
        }
      });
    },{threshold:[0,.18,.45,.8]});

    io.observe(stage);
  }else{
    inView=true;
  }

  requestAnimationFrame(function(){
    go(0,false);
    setTimeout(startAuto,650);
  });
})();


;
(() => {
 const config=window.BIBLICAL_STORE;
 const price=new Intl.NumberFormat('es-ES',{style:'currency',currency:config.currency}).format(config.price);
 const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
 let node;while(node=walker.nextNode()) {if(node.parentElement.closest('script,style'))continue;if(node.textContent.includes('US$ 19,90'))node.textContent=node.textContent.replaceAll('US$ 19,90',price);if(node.textContent.trim()==='US$ 34,00')node.parentElement.hidden=true;}
 document.querySelectorAll('.btn-pulse,[data-checkout],[data-mb-buy]').forEach(link => {
   const destination=link.closest('#oferta')?'checkout.html':'#comprar';
   if(link.tagName==='A')link.href=destination;
   else link.addEventListener('click',()=>{location.href=destination;});
 });
 document.querySelectorAll('.faq-btn').forEach(button=>button.setAttribute('aria-expanded','false'));
 // The download captured carousel dots; scripts generate fresh functional dots.
 const footer=document.createElement('div');footer.className='europe-footer';
 const note=document.createElement('p');note.textContent='Contenido digital · Importe en dólares estadounidenses · Sin entrega física';footer.append(note);
 for(const [label,url] of [['Condiciones de compra',config.termsUrl],['Política de privacidad',config.privacyUrl],['Contacto',config.supportEmail?'mailto:'+config.supportEmail:'']]) {if(!url)continue;const a=document.createElement('a');a.textContent=label;a.href=url;footer.append(a);}
 if(config.sellerName){const p=document.createElement('p');p.textContent=config.sellerName;footer.append(p);}
 document.body.append(footer);
})();

;
(() => {
 const config=window.BIBLICAL_STORE;
 const plans=config.plans;
 if(!plans)return;
 const money=value=>new Intl.NumberFormat('es-ES',{style:'currency',currency:config.currency}).format(value);
 function destination(plan){
   const raw=plans[plan].checkoutUrl;
   try{const url=new URL(raw);if(url.protocol==='https:')return url.href;}catch{}
   return 'checkout.html?plan='+plan;
 }
 const premium=document.querySelector('#oferta .price-card');
 if(!premium)return;
 premium.classList.add('premium-plan');
 premium.querySelector('.price-card-badge').textContent='PLAN PREMIUM · LA EXPERIENCIA COMPLETA';
 premium.querySelector('.price-big').textContent=money(plans.premium.price);
 const premiumLink=premium.querySelector('[data-mb-buy]');
 premiumLink.href=destination('premium');premiumLink.querySelector('span').textContent='QUIERO EL PLAN PREMIUM →';
 const grid=document.createElement('div');grid.className='plans-grid';premium.before(grid);grid.append(premium);
 const basic=document.createElement('div');basic.className='price-card basic-plan';
 basic.innerHTML='<div class="price-card-badge">PLAN BÁSICO · EL PUNTO DE PARTIDA</div><h3>Tu primer viaje por el mundo bíblico</h3><p class="price-sub">Para quienes quieren comenzar con el ebook principal.</p><div class="price-big" data-basic-price></div><div class="price-ahorro">UN SOLO PAGO</div><ul class="inc-lista"><li><span class="ck">✓</span> Ebook principal: Viaje al Mundo Bíblico</li><li><span class="ck">✓</span> Formato digital para consultar en tus dispositivos</li><li><span class="ck">✓</span> Acceso permanente al ebook</li></ul><p class="basic-plan-note">Este paquete incluye únicamente el ebook principal. Los seis volúmenes complementarios, el kit de bienvenida y el explorador interactivo forman parte del Premium.</p><button type="button" class="btn-pulse basic-plan-buy">ELEGIR EL PLAN BÁSICO →</button>';
 basic.querySelector('[data-basic-price]').textContent=money(plans.basic.price);grid.prepend(basic);
 const dialog=document.createElement('dialog');dialog.className='upgrade-dialog';dialog.setAttribute('aria-labelledby','upgrade-title');
 dialog.innerHTML='<button type="button" class="upgrade-close" aria-label="Cerrar la oferta">×</button><p class="upgrade-kicker">UN DESCUENTO ESPECIAL PARA TI</p><h2 id="upgrade-title">¡Has desbloqueado una mejora para tu viaje!</h2><p>Antes de continuar con el Básico, puedes llevarte <strong>todo el Plan Premium</strong> por un precio especial.</p><p class="upgrade-price"><s data-premium-regular></s> <strong data-premium-special></strong></p><p class="upgrade-once">Un solo pago · Sin suscripción</p><ul><li>El ebook principal Viaje al Mundo Bíblico</li><li>Los seis volúmenes complementarios</li><li>El explorador interactivo con mapas y escenas en vídeo</li><li>El kit de bienvenida y los recursos de estudio de la colección</li></ul><a class="btn-pulse upgrade-accept" data-accept-upgrade>SÍ, QUIERO EL PREMIUM POR <span data-special-label></span> →</a><a class="upgrade-decline" data-continue-basic>No, gracias. Continuar con el Básico por <span data-basic-label></span></a>';
 dialog.querySelector('[data-premium-regular]').textContent=money(plans.premium.price);
 dialog.querySelector('[data-premium-special]').textContent=money(plans.premiumSpecial.price);
 dialog.querySelector('[data-special-label]').textContent=money(plans.premiumSpecial.price);
 dialog.querySelector('[data-basic-label]').textContent=money(plans.basic.price);
 dialog.querySelector('[data-accept-upgrade]').href=destination('premiumSpecial');
 dialog.querySelector('[data-continue-basic]').href=destination('basic');
 document.body.append(dialog);
 const trigger=basic.querySelector('.basic-plan-buy');let previousOverflow;
 trigger.addEventListener('click',()=>{previousOverflow=document.body.style.overflow;dialog.showModal();document.body.style.overflow='hidden';});
 dialog.querySelector('.upgrade-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});
 dialog.addEventListener('close',()=>{document.body.style.overflow=previousOverflow||'';trigger.focus();});
})();

;
(() => {
 const config=window.BIBLICAL_STORE, offer=config.promotion;
 if(!offer)return;
 const demo=offer.demo===true;
 const formatMoney=value=>new Intl.NumberFormat('es-ES',{style:'currency',currency:config.currency}).format(value);
 const duration=Math.round((Number.isFinite(offer.countdownMinutes)&&offer.countdownMinutes>0?offer.countdownMinutes:14+13/60)*60*1000);
 // Start a fresh countdown on each page visit. No saved deadline or expiry state.
 let deadline=Date.now()+duration;
 const banner=document.querySelector('#comprar .urgencia-inner');
 if(banner && Number.isFinite(deadline)){
   banner.replaceChildren();
   const label=document.createElement('p');label.className='offer-kicker';label.textContent=(demo?'DEMO · ':'')+'PRECIO DE BIENVENIDA POR TIEMPO LIMITADO';
   const title=document.createElement('p');title.className='offer-title';title.textContent='Aprovecha este precio antes de que termine el plazo';
   const clock=document.createElement('div');clock.className='offer-clock';clock.setAttribute('aria-label','Tiempo restante para acceder al precio promocional');
   const parts=['días','h','min','seg'].map(unit=>{const box=document.createElement('div');box.className='offer-time';const number=document.createElement('strong');number.textContent='00';const text=document.createElement('span');text.textContent=unit;box.append(number,text);clock.append(box);return {box,number};});
   const note=document.createElement('p');note.className='offer-after';
   note.append(document.createTextNode('⚡ Al finalizar el plazo, vuelve a su precio habitual de '));
   const regularPrice=document.createElement('strong');regularPrice.textContent=formatMoney(offer.regularPrice);note.append(regularPrice,document.createTextNode('.'));
   banner.append(label,title,clock,note);
   function update(){
     if(Date.now()>=deadline)deadline=Date.now()+duration;
     const seconds=Math.max(0,Math.ceil((deadline-Date.now())/1000));
     [Math.floor(seconds/86400),Math.floor(seconds/3600)%24,Math.floor(seconds/60)%60,seconds%60].forEach((value,i)=>parts[i].number.textContent=String(value).padStart(2,'0'));
     parts[0].box.hidden=seconds<86400;
   }
   update();setInterval(update,1000);
 }
 const remaining=demo && offer.remaining==null?27:offer.remaining;
 const total=demo && offer.total==null?100:offer.total;
 if(Number.isInteger(remaining)&&remaining>=0){
   const cta=document.querySelector('#oferta [data-mb-buy]');
   if(cta){
     const stock=document.createElement('div');stock.className='offer-stock';
     if(demo){const preview=document.createElement('small');preview.className='offer-stock-preview';preview.textContent='DEMO · VISTA DE LA PROMOCIÓN';stock.append(preview);}
     const head=document.createElement('div');head.className='offer-stock-head';
     const active=document.createElement('span');active.className='offer-stock-active';active.textContent=remaining?'Promoción de bienvenida en curso':'Cupos promocionales agotados';
     const badge=document.createElement('span');badge.className='offer-stock-badge';badge.textContent=remaining?'Últimos cupos':'Agotado';head.append(active,badge);stock.append(head);
     const validTotal=Number.isInteger(total)&&total>0&&remaining<=total;
     const taken=validTotal?Math.round((total-remaining)/total*100):null;
     if(validTotal){
       const bar=document.createElement('div');bar.className='offer-stock-bar';bar.setAttribute('role','progressbar');bar.setAttribute('aria-label','Porcentaje de cupos promocionales utilizados');bar.setAttribute('aria-valuemin','0');bar.setAttribute('aria-valuemax','100');bar.setAttribute('aria-valuenow',String(taken));
       const fill=document.createElement('div');fill.className='offer-stock-fill';fill.style.width=taken+'%';bar.append(fill);stock.append(bar);
     }
     const footer=document.createElement('div');footer.className='offer-stock-footer';
     const limited=document.createElement('span');limited.textContent='Cupos limitados';const percent=document.createElement('strong');percent.textContent=validTotal?taken+'% reservado':remaining+' cupos promocionales disponibles';footer.append(limited,percent);stock.append(footer);
     cta.before(stock);if(!demo&&remaining===0){cta.hidden=true;}
   }
 }
 const examples=[{name:'Emma W.',country:'Reino Unido'},{name:'Lukas M.',country:'Alemania'},{name:'Sophie D.',country:'Francia'},{name:'Giulia R.',country:'Italia'},{name:'Oliver B.',country:'Irlanda'},{name:'Eva S.',country:'Países Bajos'}];
 const purchases=demo?examples:(Array.isArray(offer.purchases)?offer.purchases:[]).filter(p=>p&&typeof p.name==='string'&&typeof p.country==='string'&&Number.isFinite(Date.parse(p.purchasedAt))&&Date.parse(p.purchasedAt)<=Date.now());
 if(!purchases.length)return;
 const toast=document.createElement('aside');toast.className='purchase-toast';toast.setAttribute('aria-live','polite');toast.setAttribute('aria-atomic','true');toast.hidden=true;
 const icon=document.createElement('div');icon.className='purchase-toast-icon';icon.setAttribute('aria-hidden','true');
 const body=document.createElement('div'),label=document.createElement('small'),person=document.createElement('strong'),product=document.createElement('p'),time=document.createElement('span'),close=document.createElement('button');
 label.textContent=demo?'DEMO · COMPRA DE EJEMPLO FICTICIA':'COMPRA RECIENTE';product.textContent='Ha adquirido la colección Viaje al Mundo Bíblico 3D';close.type='button';close.className='purchase-toast-close';close.textContent='×';close.setAttribute('aria-label','Cerrar los avisos de compra');body.append(label,person,product,time);toast.append(icon,body,close);document.body.append(toast);
 let pending,hideTimer,stopped=false,last=-1;
 close.addEventListener('click',()=>{stopped=true;clearTimeout(pending);clearTimeout(hideTimer);toast.hidden=true;});
 const random=(min,max)=>Math.floor(min+Math.random()*(max-min+1));
 function schedule(){if(!stopped)pending=setTimeout(show,random(18000,35000));}
 function show(){
   if(stopped)return;
   if(document.hidden){schedule();return;}
   let index=random(0,purchases.length-1);if(purchases.length>1&&index===last)index=(index+1)%purchases.length;last=index;
   const purchase=purchases[index];person.textContent=purchase.name+' · '+purchase.country;
   if(demo){
     icon.className='purchase-toast-icon purchase-toast-avatar';
     icon.style.backgroundPosition=(index%3)*50+'% '+Math.floor(index/3)*100+'%';
     icon.textContent='';
   }else{
     icon.className='purchase-toast-icon';
     icon.textContent=purchase.name.split(/\s+/).slice(0,2).map(part=>part[0]).join('');
   }
   const minutes=demo?random(1,9):Math.max(0,Math.floor((Date.now()-Date.parse(purchase.purchasedAt))/60000));
   time.textContent=(demo?'Ejemplo: ':'')+(minutes===0?'Hace un momento':minutes<60?'Hace '+minutes+' minuto'+(minutes===1?'':'s'):minutes<1440?'Hace '+Math.floor(minutes/60)+' horas':'Hace '+Math.floor(minutes/1440)+' días');
   toast.hidden=false;hideTimer=setTimeout(()=>{toast.hidden=true;schedule();},6500);
 }
 pending=setTimeout(show,random(6000,10000));
})();
