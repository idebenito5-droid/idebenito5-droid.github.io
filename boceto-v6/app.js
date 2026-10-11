// TALMUT · Boceto v6 — interacción
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const SUIT={S:'♠',H:'♥',D:'♦',C:'♣'};
const LV=['Noob','Cuervecillo','Soldado Maltés','As del Talmutaje','Sheriff'];
const LVR=['0–10','11–25','26–42','43–59','60'];

// ---------- cartas ----------
function val(r){return r==='A'?1:r==='J'?20:r==='Q'?30:r==='K'?40:r==='X'?-1:+r}
function card(c,cls=''){
  if(!c)return `<div class="cd back ${cls}"></div>`;
  if(c==='X')return `<div class="cd face joker ${cls}"><div class="r">★</div><div class="c"><svg viewBox="0 0 60 30"><path d="M30 17 C26 12 18 4 2 7 C11 9 17 13 20 17 C23 19 27 19 29 19 L26 24 L31 21 L35 23 C38 19 43 13 58 6 C46 6 38 10 33 15 Z"/></svg></div><div class="val">−1</div></div>`;
  const r=c.slice(0,-1),s=c.slice(-1),red=s==='H'||s==='D',court='JQK'.includes(r);
  return `<div class="cd face ${red?'red':''} ${cls}"><div class="r">${r}<i>${SUIT[s]}</i></div><div class="c ${court?'court':''}">${court?r:SUIT[s]}</div><div class="r r2">${r}<i>${SUIT[s]}</i></div><div class="val">${val(r)} PTS</div></div>`;
}
function plHTML(p,i){
  const off=[20,60,95][i%3];
  return `<div class="opp"><div class="pl frame ch"><span class="fr"></span><span class="ring"><span class="av" style="background-image:url(img/lv${p.lv}.webp)"></span><svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="20" stroke="rgba(255,255,255,.12)"/><circle cx="22" cy="22" r="20" stroke="${p.c}" stroke-dasharray="125.6" stroke-dashoffset="${off}"/></svg></span><span class="nm">${p.n}<small>${p.s}</small></span></div><div class="hand mini">${'<div class="cd back"></div>'.repeat(p.k)}</div></div>`;
}
const OPP=[{n:'Lucía',lv:3,s:'AS · 3 CARTAS',k:3,c:'#3FE0CF'},{n:'Pablo',lv:1,s:'CUERVECILLO',k:4,c:'#A98BFF'},{n:'Marta',lv:4,s:'SHERIFF',k:4,c:'#FF8A3D'}];
function buildTable(){
  $('#opps').innerHTML=OPP.map(plHTML).join('');
  $('#tOpps').innerHTML=OPP.map(plHTML).join('');
  $('#discard').innerHTML=card('7H');
  $('#tDiscard').innerHTML=card('4C');
  myHand=['5S',null,null,'2D'];renderHand();
  $('#tHand').innerHTML=[card(null,'known'),card(null),card(null),card(null,'known')].join('');
}
let myHand=[],drawn='QH',swapping=false;
function renderHand(){
  $('#myHand').innerHTML=myHand.map((c,i)=>`<div onclick="handClick(${i})" style="cursor:pointer">${card(null,(i===0||i===3?'known ':'')+(swapping?'pick':''))}</div>`).join('');
}
function drawCard(){play('flip');$('#drawnCard').innerHTML=card(drawn);$('#drawn').classList.add('on')}
function closeDrawn(){$('#drawn').classList.remove('on');$('#discard').innerHTML=card(drawn);play('flip')}
function swapMode(){$('#drawn').classList.remove('on');swapping=true;renderHand();toast('Elige qué carta tuya cambias')}
function handClick(i){if(!swapping)return;swapping=false;renderHand();$('#discard').innerHTML=card(i===0?'5S':'9C');play('flip');toast('Cambiada. La Reina queda boca abajo en tu mano')}
function talmut(){
  const e=$('#epic');e.classList.add('on','flash');$('#app').classList.add('shake');
  play('boom');setTimeout(caw,350);setTimeout(()=>{e.classList.remove('flash');$('#app').classList.remove('shake')},600);
}

// ---------- revisión ----------
const RV=[
  {n:'Nacho',lv:2,h:['AS','2D','XR','3C'],p:5,t:25,cls:'win tal'},
  {n:'Lucía',lv:3,h:['4H','6S','2C'],p:12,t:49},
  {n:'Pablo',lv:1,h:['KD','AC','9H','5D'],p:55,t:70},
  {n:'Marta',lv:4,h:['10S','JH','3D','8C'],p:41,t:75}];
function buildReview(){
  $('#review').innerHTML=RV.map((r,i)=>`<div class="rw frame ch ${r.cls||''}" style="animation-delay:${.12*i+.1}s"><span class="fr"></span><div class="who"><span class="av" style="background-image:url(img/lv${r.lv}.webp)"></span>${r.n}</div><div class="hand">${r.h.map(c=>card(c==='XR'?'X':c)).join('')}</div><div class="pts">${r.p}<small>RONDA</small></div><div class="tot">${r.t}<small>TOTAL</small></div></div>`).join('');
}

// ---------- perfil / chapitas ----------
const ICON={
 crow:'<path d="M3 14c3-1 5-4 9-5 2-.5 3-2 5-2l3 .5-2 1c0 3-2 6-6 7l-2 3-1-2.5c-2 0-4-1-6-2z"/>',
 crown:'<path d="M4 18h16l1-10-5 4-4-7-4 7-5-4z"/>',
 cards:'<rect x="4" y="5" width="10" height="14" rx="1.5"/><path d="M14 7l5 1.5-3 12-6-1.6"/>',
 flame:'<path d="M12 3c2 4 6 5 6 10a6 6 0 0 1-12 0c0-3 2-4 2-7 2 1 3 3 3 5 1-2 1-5 1-8z"/>',
 eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
 sword:'<path d="M14 4h6v6L9 21l-3-3zM5 15l4 4M3 21l3-3"/>',
 cross:'<path d="M12 3l2 5 5-2-2 5 5 1-5 1 2 5-5-2-2 5-2-5-5 2 2-5-5-1 5-1-2-5 5 2z"/>',
 star:'<path d="M12 3l2.6 5.6 6 .6-4.5 4 1.3 6L12 16.3 6.6 19.2l1.3-6-4.5-4 6-.6z"/>',
 nest:'<path d="M3 13c2 5 16 5 18 0M5 13c3 2 11 2 14 0"/><circle cx="9" cy="10" r="2"/><circle cx="14" cy="10" r="2"/>',
 bolt:'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>'};
const ACH=[['Cuarenta y dos','Gana una ronda con 42 en la mesa','star'],['Nido lleno','Juega con 6 en la misma sala','nest'],['Primer graznido','Canta TALMUT por primera vez','crow'],['Ojo de cuervo','Recuerda 4 cartas en una ronda','eye'],['Mano de hierro','Gana sin cambiar ninguna carta','sword'],['Rey caído','Descarta tres K en una partida','crown'],['Relámpago','Descarte rápido en menos de 1 s','bolt'],['Comodín negro','Acaba una ronda en −1','cards'],['Orden de Malta','Llega a Soldado Maltés','cross'],['Fuego cruzado','Gana 3 partidas seguidas','flame'],['Sin piedad','Gana al Señor de la Guerra','sword'],['Madrugador','Juega antes de las 8:00','star'],['Trasnochador','Juega después de las 2:00','crow'],['Doble o nada','Dos TALMUT seguidos acertados','bolt'],['Vista de halcón','Mira 10 cartas con poderes','eye'],['Corona','Gana una partida online','crown']];
const GOT=new Set([0,2,3,4,6,8,9,11,13,14,15]);
function achHTML(a,i){const got=i<35&&(GOT.has(i)||i>16);return `<button class="ach ch ${got?'':'lock'} ${i===0||i===1?'star':''} ${i===0||i===4||i===8?'new':''}" onclick="toast('${a[0]} — ${a[1]}')"><span class="hex"><span><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="${got?'#FFE6A1':'#555'}" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">${ICON[a[2]]}</svg></span></span><b>${a[0]}</b><small>${a[1]}</small></button>`}
function buildBadges(){
  const extra=['Paciencia de monje','Tabernero','Buen perdedor','Cuervo viajero','Callado','El que avisa','Mesa redonda','Tres de tres','Último aliento','Baraja nueva','Cara de póker','Memorión','Golpe de suerte','Leal a la Orden','Vuelo nocturno','Pluma de oro','Sheriff del pueblo','Mil cartas','Al filo','Ni una K','Contrarreloj','Bandada','Rey de la tabla','El silencio','Buen ojo','Cien partidas','Racha de 5','Rondas cortas','Despiste','Sin miedo','Último en caer','Graznido final','Corazón frío','Leyenda','Barón de cartas','El 60','Pico de oro','Garras','Plumas negras','Ala rota','Mano limpia','Nido de águilas','Cuervo sabio','Ojo avizor'];
  const keys=Object.keys(ICON);const all=ACH.slice();let k=0;
  while(all.length<60){all.push([extra[k],'Reto secreto del nido',keys[k%keys.length]]);k++}
  $('#achGrid').innerHTML=all.map(achHTML).join('');
  $('#recent').innerHTML=[0,4,8,2,3].map(i=>achHTML(all[i],i)).join('');
  $('#path').innerHTML=LV.map((n,i)=>`<div class="st ${i<2?'got':''} ${i===2?'cur':''}"><i style="background-image:url(img/lv${i}.webp)"></i><span>${n}<br>${LVR[i]}</span></div>`).join('');
}

// ---------- tutorial ----------
const TUT=[
 ['Bienvenido a mi mesa. Soy <b>Juanjo</b>. Aquí gana quien acaba con <b>menos puntos</b>.',50,80,320,120],
 ['Tienes <b>4 cartas boca abajo</b>. Al empezar puedes mirar <b>dos</b>: las marcadas con el ojo. Memorízalas.',50,82,330,120],
 ['En tu turno, <b>roba del mazo</b>. Puedes cambiarla por una tuya o tirarla al descarte.',40,50,140,140],
 ['Ojo con el <b>descarte</b>: si sale un número que tienes, <b>tíralo rápido</b> aunque no sea tu turno.',60,50,140,140],
 ['Las figuras tienen poderes: el <b>10</b> mira, la <b>J</b> intercambia, la <b>Q</b> espía y la <b>K</b>… pesa 40.',50,50,420,170],
 ['Vigila a tus rivales. Cada carta que cambian es una pista. <b>Yo nunca olvido una.</b>',50,14,520,110],
 ['Cuando creas tener <b>5 o menos</b>, canta <b>TALMUT</b>. Los demás juegan una última vuelta. Si fallas… cra, cra.',50,80,520,150]];
let ti=0,typeT=null;
function tutShow(){
  const t=TUT[ti],d=$('#dim');d.style.setProperty('--sx',t[1]+'%');d.style.setProperty('--sy',t[2]+'%');d.style.setProperty('--rw',t[3]+'px');d.style.setProperty('--rh',t[4]+'px');
  $('#tutN').textContent=(ti+1)+'/'+TUT.length;
  $('#steps').innerHTML=TUT.map((_,i)=>`<i class="${i<=ti?'on':''}"></i>`).join('');
  const el=$('#coachTxt'),html=t[0];clearInterval(typeT);let n=0;const plain=html.replace(/<[^>]+>/g,'');
  typeT=setInterval(()=>{n+=2;if(n>=plain.length){clearInterval(typeT);el.innerHTML=html;return}el.innerHTML=plain.slice(0,n)+'<span class="caret"></span>'},22);
  if(ti===0)caw();
}
function tutNext(){ti++;if(ti>=TUT.length){ti=0;go('levelup');return}play('tick');tutShow()}

// ---------- navegación ----------
const BG={splash:'castle',menu:'castle',online:'castle',arcade:'castle',local:'castle',game:'table',review:'castle',profile:'castle',badges:'castle',tutorial:'table',levelup:'castle'};
function go(id){
  $$('.screen').forEach(s=>s.classList.toggle('on',s.id==='s-'+id));
  const bg=$('#bg');bg.className='scene-bg bg-'+BG[id];
  $('#crows').style.opacity=BG[id]==='table'?0:1;
  $('#epic').classList.remove('on');$('#drawn').classList.remove('on');
  if(id==='tutorial'){ti=0;tutShow()}
  if(id==='levelup'){play('win');setTimeout(caw,600)}
  if(id==='review')buildReview();
  $$('#dockList button').forEach(b=>b.classList.toggle('on',b.dataset.id===id));
  $('#dock').classList.remove('open');play('tick');
  try{history.replaceState(null,'','#'+id)}catch(e){}
}
function pickRv(b){$$('.rv').forEach(x=>x.classList.toggle('sel',x===b));play('tick')}
document.addEventListener('click',e=>{const b=e.target.closest('[data-seg] button');if(b){b.parentNode.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));play('tick')}});
let tT;function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(tT);tT=setTimeout(()=>t.classList.remove('on'),1800)}

// ticker
const LINES=['Te faltan 8 chapitas para As del Talmutaje. ¿Una partidita?','Con 5 o menos, canta TALMUT. Si no… cra, cra.','Una K son 40 puntos. Pesa más que yo.','Descarte rápido: si sale tu número, ¡tírala!','En ARCADE los rivales no se cansan. Yo tampoco.','Yo tengo buena memoria. ¿Y tú?'];
let li=0;setInterval(()=>{const el=$('#tick');if(!el)return;el.style.opacity=0;setTimeout(()=>{li=(li+1)%LINES.length;el.textContent=LINES[li];el.style.opacity=1},350)},6000);

// parallax con el ratón
addEventListener('pointermove',e=>{const x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;$('#bg').style.transform=`translate(${x*-18}px,${y*-12}px) scale(1.03)`});

// cuervos volando
(function(){const box=$('#crows');const sv='<svg viewBox="0 0 60 30"><path d="M30 17 C26 12 18 4 2 7 C11 9 17 13 20 17 C23 19 27 19 29 19 L26 24 L31 21 L35 23 C38 19 43 13 58 6 C46 6 38 10 33 15 Z" fill="#050304"/></svg>';
for(let i=0;i<9;i++){const d=document.createElement('div');d.className='crow';const w=22+Math.random()*40,dur=16+Math.random()*18,y0=4+Math.random()*40,y1=y0+(Math.random()*20-10);
d.style.cssText=`width:${w}px;height:${w/2}px;opacity:${(.35+w/90).toFixed(2)};--y0:${y0}vh;--y1:${y1}vh;animation-duration:${dur}s;animation-delay:${-Math.random()*dur}s`;d.innerHTML=sv;d.firstChild.style.animationDuration=(.35+Math.random()*.3)+'s';box.appendChild(d)}})();

// brasas
(function(){const c=$('#embers'),x=c.getContext('2d');let W,H,P=[];function rs(){W=c.width=innerWidth*devicePixelRatio;H=c.height=innerHeight*devicePixelRatio}rs();addEventListener('resize',rs);
for(let i=0;i<70;i++)P.push(nw(true));function nw(a){return{x:Math.random()*W,y:a?Math.random()*H:H+10,r:(Math.random()*1.8+.6)*devicePixelRatio,v:(Math.random()*.5+.2)*devicePixelRatio,s:Math.random()*6.28,h:Math.random()<.75?32:46}}
(function f(){x.clearRect(0,0,W,H);x.globalCompositeOperation='lighter';for(const p of P){p.y-=p.v;p.s+=.02;p.x+=Math.sin(p.s)*.4;if(p.y<-10)Object.assign(p,nw());const a=Math.min(1,p.y/H)*.9;const g=x.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*4);g.addColorStop(0,`hsla(${p.h},100%,70%,${a})`);g.addColorStop(1,'hsla(30,100%,50%,0)');x.fillStyle=g;x.beginPath();x.arc(p.x,p.y,p.r*4,0,6.28);x.fill()}requestAnimationFrame(f)})()})();

// ---------- sonido (sintetizado) ----------
let AC=null,soundOn=true;
function ac(){if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)()}catch(e){}}if(AC&&AC.state==='suspended')AC.resume();return AC}
function toggleSound(b){soundOn=!soundOn;b.style.opacity=soundOn?1:.45;toast(soundOn?'Sonido activado':'Silencio')}
function noise(t0,f,d,v){const c=ac();if(!c)return;const b=c.createBuffer(1,c.sampleRate*d,c.sampleRate),a=b.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=(Math.random()*2-1)*(1-i/a.length);const s=c.createBufferSource(),fl=c.createBiquadFilter(),g=c.createGain();s.buffer=b;fl.type='bandpass';fl.frequency.value=f;g.gain.value=v;s.connect(fl);fl.connect(g);g.connect(c.destination);s.start(c.currentTime+t0)}
function caw(){if(!soundOn)return;const c=ac();if(!c)return;[0,.3].forEach((t0,i)=>{const t=c.currentTime+t0,o=c.createOscillator(),o2=c.createOscillator(),f=c.createBiquadFilter(),g=c.createGain(),l=c.createOscillator(),lg=c.createGain();const p=i?470:540;
o.type='sawtooth';o.frequency.setValueAtTime(p,t);o.frequency.linearRampToValueAtTime(p*1.08,t+.05);o.frequency.exponentialRampToValueAtTime(p*.68,t+.24);o2.type='square';o2.frequency.setValueAtTime(p*1.5,t);o2.frequency.exponentialRampToValueAtTime(p*.95,t+.24);
l.frequency.value=62;lg.gain.value=.5;l.connect(lg);lg.connect(g.gain);f.type='bandpass';f.frequency.value=1300;f.Q.value=2.5;o.connect(f);o2.connect(f);f.connect(g);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.25,t+.025);g.gain.exponentialRampToValueAtTime(.0001,t+.27);g.connect(c.destination);[o,o2,l].forEach(x=>{x.start(t);x.stop(t+.3)})});for(let i=0;i<4;i++)noise(.5+i*.09,700,.06,.12)}
function play(k){if(!soundOn)return;const c=ac();if(!c)return;const t=c.currentTime;
 if(k==='tick'){const o=c.createOscillator(),g=c.createGain();o.frequency.value=1800;g.gain.setValueAtTime(.05,t);g.gain.exponentialRampToValueAtTime(.0001,t+.05);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+.06)}
 if(k==='flip')noise(0,2400,.09,.35);
 if(k==='boom'){const o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.setValueAtTime(120,t);o.frequency.exponentialRampToValueAtTime(35,t+.6);g.gain.setValueAtTime(.6,t);g.gain.exponentialRampToValueAtTime(.0001,t+.7);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+.7);noise(0,500,.5,.5)}
 if(k==='win'){[523,659,784,1047].forEach((f,i)=>{const o=c.createOscillator(),g=c.createGain();o.type='triangle';o.frequency.value=f;g.gain.setValueAtTime(.0001,t+i*.09);g.gain.exponentialRampToValueAtTime(.12,t+i*.09+.02);g.gain.exponentialRampToValueAtTime(.0001,t+i*.09+.6);o.connect(g);g.connect(c.destination);o.start(t+i*.09);o.stop(t+i*.09+.7)})}
}

// ---------- arranque ----------
buildTable();buildBadges();
$('#dockList').innerHTML=$$('.screen').map((s,i)=>`<button data-id="${s.id.slice(2)}" onclick="go('${s.id.slice(2)}')"><i>${String(i).padStart(2,'0')}</i>${s.dataset.name}</button>`).join('')+`<button onclick="go('game');setTimeout(drawCard,500)"><i>5b</i>Mesa · carta robada</button><button onclick="go('game');setTimeout(talmut,500)"><i>5c</i>Mesa · ¡TALMUT!</button>`;
const h=location.hash.slice(1);if(h&&$('#s-'+h))go(h);
