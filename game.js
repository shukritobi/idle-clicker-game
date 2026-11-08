(()=>{"use strict";
const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s)), KEY="dot-idle-v1";
const B=[
["Pocket spark","✦","#f2eaff",15,.2,1.16,"A tiny start."],
["Little robot","🤖","#e7f6ff",110,2,1.17,"Taps for you."],
["Coffee engine","☕","#fff1df",1300,15,1.18,"Fueled by tiny beans."],
["Moon garden","🌱","#e8faef",12000,110,1.18,"Grow a little magic."],
["Cloud factory","☁️","#edf2ff",145000,800,1.19,"Pure daydreams."],
["Star collector","⭐","#fff5d8",1200000,6500,1.19,"Bottled starlight."],
["Neon city","🌆","#e9ebff",13000000,50000,1.20,"Bright all night."],
["Time machine","⌛","#f0ebff",170000000,400000,1.20,"More time."],
["Dream portal","🪄","#fbeeff",2600000000,3200000,1.21,"Reality? Optional."],
["Solar forge","☀️","#fff1d9",36000000000,26000000,1.21,"A sun in your pocket."],
["Crystal planet","🪐","#eeedff",600000000000,220000000,1.21,"Shiny things happen."],
["Galaxy farm","🌌","#e7efff",11000000000000,1800000000,1.22,"The endless harvest."],
["Black hole","🕳️","#eeeefa",150000000000000,16000000000,1.22,"Where did it go?"],
["Quantum loop","♾️","#f5eaff",2200000000000000,140000000000,1.22,"Again, but better."],
["Universe lab","🔬","#e8f7fa",38000000000000000,1250000000000,1.23,"Tiny science. Big results."],
["Multiverse","🌀","#eceaff",600000000000000000,11500000000000,1.23,"One wasn't enough."],
["Eternity core","💎","#e4f8fa",9000000000000000000,105000000000000,1.23,"Forever, on tap."],
["Cosmic hive","🐝","#fff0d5",160000000000000000000,950000000000000,1.24,"Buzz across infinity."],
["Origin engine","⚛️","#f2e9ff",3e21,8.5e15,1.24,"Make your own beginning."],
["Everything","🌈","#f0e9ff",6e22,8e16,1.25,"All of it. Seriously."]
];
const U=[
["power","👆","Stronger taps","+1 base energy per tap",45,2.6,40],
["crit","💥","Lucky taps","+2.5% chance for a 5× hit",240,3,30],
["momentum","🔥","Hot streak","Longer and stronger combos",650,3.1,25],
["discount","🏷️","Smart shopping","Generators cost 2% less",1800,3.5,20],
["boost","🚀","Turbo engines","+25% passive power",4000,3.4,35],
["offline","🌙","Sleep mode","More earnings while away",7000,3.6,8]];
const A=[
["first","✳","Hello, world","Tap once",s=>s.taps>=1],
["taps50","👆","Getting started","50 taps",s=>s.taps>=50],
["taps500","⚡","Can't stop","500 taps",s=>s.taps>=500],
["taps5000","🔥","Tap legend","5,000 taps",s=>s.taps>=5000],
["combo20","💨","In the zone","20× combo",s=>s.bestCombo>=20],
["combo50","🌪️","Unstoppable","50× combo",s=>s.bestCombo>=50],
["one","🤖","Little helper","Buy a generator",s=>ownedTotal(s)>=1],
["ten","🏡","Small business","Own 10 generators",s=>ownedTotal(s)>=10],
["hundred","🏙️","Big business","Own 100 generators",s=>ownedTotal(s)>=100],
["thousand","🌍","Empire","Own 1,000 generators",s=>ownedTotal(s)>=1000],
["oneK","💰","First thousand","Earn 1K lifetime",s=>s.lifetime>=1000],
["million","💎","Million club","Earn 1M lifetime",s=>s.lifetime>=1e6],
["billion","👑","Billion club","Earn 1B lifetime",s=>s.lifetime>=1e9],
["trillion","🪐","Cosmic fortune","Earn 1T lifetime",s=>s.lifetime>=1e12],
["firstCrit","🍀","Feeling lucky","Land a lucky tap",s=>s.crits>=1],
["crit100","🎯","Lucky streak","100 lucky taps",s=>s.crits>=100],
["firstBoost","🚀","Full speed","Use overdrive",s=>s.boosts>=1],
["firstStar","✦","Reborn","Prestige once",s=>s.prestiges>=1],
["tenStars","🌟","Stargazer","Get 10 stars",s=>s.stars>=10],
["hundredStars","🌌","Starbound","Get 100 stars",s=>s.stars>=100],
["allPerks","🧪","Scientist","Buy 20 research levels",s=>Object.values(s.perks).reduce((a,b)=>a+b,0)>=20],
["allBuildings","🎇","Everything bagel","Unlock all 20 tiers",s=>s.owned[19]>0],
["daily7","🎁","Regular","Claim 7 daily rewards",s=>s.dailyClaims>=7],
["meteor10","☄️","Star catcher","Collect 10 meteors",s=>s.meteors>=10]];
const blank=()=>({v:1,coins:0,lifetime:0,runEarned:0,taps:0,bestCombo:0,combo:0,lastTap:0,owned:B.map(()=>0),perks:Object.fromEntries(U.map(x=>[x[0],0])),prestiges:0,stars:0,awards:[],crits:0,boosts:0,meteors:0,dailyClaims:0,dailyStreak:0,dailyDate:"",driveEnd:0,driveReady:0,created:Date.now(),saved:Date.now(),playMs:0,settings:{sound:true,music:false,particles:true,memes:true}});
let s=blank(),tab="build",qty=1,ctx=null,musicTimer=null,musicStep=0,lastTapSound=0,toastTimer=null,nextMeteor=Date.now()+55000,meteorEnd=0,modalAction=null;
const clamp=(x,a,b)=>Math.min(b,Math.max(a,x)),ownedTotal=x=>x.owned.reduce((a,b)=>a+b,0);
function fmt(n){n=Number(n)||0;if(n<0)return "-"+fmt(-n);if(n<1000)return n<10&&n%1?n.toFixed(1):n<100&&n%1?n.toFixed(1):Math.floor(n).toLocaleString("en-US");let k=Math.floor(Math.log10(n)/3),v=n/Math.pow(1000,k),t=["K","M","B","T","Qa","Qi","Sx","Sp","Oc","No","Dc","Ud","Dd","Td","Qad","Qid"];return k<=t.length?v.toFixed(v<10?2:v<100?1:0).replace(/\.0+$/,"")+t[k-1]:n.toExponential(2).replace("e+","e")}
const permanent=()=>1+s.stars*.14,boost=()=>Date.now()<s.driveEnd?3:1,discount=()=>Math.pow(.98,s.perks.discount),milestone=n=>Math.pow(2,[10,25,50,100,200,400,800].filter(x=>n>=x).length);
function pps(){return B.reduce((a,b,i)=>a+b[4]*s.owned[i]*milestone(s.owned[i]),0)*permanent()*Math.pow(1.25,s.perks.boost)*boost()}
function tapValue(){return (1+s.perks.power)*permanent()*boost()*(1+Math.min(s.combo,75)*(.012+s.perks.momentum*.006))}
function cost(i){return B[i][3]*Math.pow(B[i][5],s.owned[i])*discount()}
function quote(i,num){let wasMax=num==="max";let r=B[i][5],start=cost(i);if(num==="max"){num=s.coins<start?1:clamp(Math.floor(Math.log(1+(s.coins*(r-1))/start)/Math.log(r)+1e-9),1,1000000)}let price=start*(Math.pow(r,Number(num))-1)/(r-1);if(wasMax&&price>s.coins){while(num>1&&price>s.coins){num--;price=start*(Math.pow(r,Number(num))-1)/(r-1)}}return {n:Number(num),cost:price}}
function add(n){if(Number.isFinite(n)&&n>0){s.coins+=n;s.lifetime+=n;s.runEarned+=n}}
function save(){s.saved=Date.now();try{localStorage.setItem(KEY,JSON.stringify(s));let e=document.getElementById("saveState");if(e)e.textContent="✓ SAVED "+new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}catch(e){console.warn(e);let x=document.getElementById("saveState");if(x)x.textContent="SAVE FAILED"}}
function load(){try{let x=JSON.parse(localStorage.getItem(KEY)||"null");if(!x||x.v!==1)return;let q=blank();Object.assign(q,x);q.owned=B.map((_,i)=>clamp(Math.floor(Number(x.owned?.[i])||0),0,1e8));for(let u of U)q.perks[u[0]]=clamp(Math.floor(Number(x.perks?.[u[0]])||0),0,u[6]);for(let k of ["coins","lifetime","runEarned","taps","bestCombo","prestiges","stars","crits","boosts","meteors","dailyClaims","dailyStreak","driveEnd","driveReady","created","saved","playMs"]){let val=Number(q[k]);q[k]=Number.isFinite(val)?Math.max(0,val):0}q.awards=Array.isArray(x.awards)?x.awards.filter(id=>A.some(a=>a[0]===id)):[];q.settings={sound:x.settings?.sound!==false,music:x.settings?.music===true,particles:x.settings?.particles!==false,memes:x.settings?.memes!==false};q.combo=0;q.lastTap=0;s=q}catch(e){console.warn("Invalid save",e)}}
function wakeAudio(){if(!s.settings.sound&&!s.settings.music)return null;try{let C=window.AudioContext||window.webkitAudioContext;if(!C)return null;if(!ctx)ctx=new C();if(ctx.state==="suspended")ctx.resume().catch(()=>{});return ctx}catch(e){return null}}
function tone(freq=400,duration=.12,type="sine",volume=.05,delay=0){let a=wakeAudio();if(!a)return;try{let t=a.currentTime+delay,o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.setValueAtTime(freq,t);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.0002,volume),t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+duration+.02)}catch(e){}}
function fx(name){if(!s.settings.sound)return;if(name==="tap"){let t=performance.now();if(t-lastTapSound<42)return;lastTapSound=t;tone(370+Math.min(s.combo,30)*9,.08,"sine",.039)}if(name==="crit"){tone(620,.16,"triangle",.08);tone(940,.21,"sine",.06,.065)}if(name==="buy"){tone(450,.09,"triangle",.06);tone(640,.14,"sine",.05,.065)}if(name==="unlock"){tone(523,.12,"sine",.07);tone(659,.12,"sine",.07,.1);tone(784,.24,"triangle",.07,.21)}if(name==="boost"){tone(170,.24,"sawtooth",.035);tone(390,.15,"triangle",.05,.11);tone(740,.28,"sine",.08,.24)}}
const melody=[261.63,329.63,392,493.88,392,329.63,293.66,349.23,440,349.23,293.66,261.63];
function music(){if(musicTimer)clearInterval(musicTimer);musicTimer=null;if(!s.settings.music)return;wakeAudio();musicTimer=setInterval(()=>{if(document.hidden||!s.settings.music)return;let f=melody[musicStep++%melody.length]/2;tone(f,.46,"sine",.014);if(musicStep%4===0)tone(f/2,.8,"triangle",.007)},570)}
function vibrate(){try{navigator.vibrate?.(9)}catch(e){}}
function fly(x,y,label,rare){if(!s.settings.particles)return;let host=$("#particles"),e=document.createElement("span");e.className="particle";e.textContent=label;e.style.left=x+"px";e.style.top=y+"px";e.style.setProperty("--dx",(Math.random()-.5)*65+"px");e.style.setProperty("--dy",(-65-Math.random()*55)+"px");if(rare)e.style.color="#ff9753";host.appendChild(e);setTimeout(()=>e.remove(),900);for(let i=0;i<(rare?13:5);i++){let p=document.createElement("i");p.className="spark";p.style.left=x+"px";p.style.top=y+"px";p.style.setProperty("--x",(Math.random()-.5)*(rare?215:125)+"px");p.style.setProperty("--y",(Math.random()-.5)*(rare?215:125)+"px");p.style.setProperty("--spark",rare?"#ffbc64":i%2?"#c3b7ff":"#8876f5");host.appendChild(p);setTimeout(()=>p.remove(),800)}}
function tap(ev){wakeAudio();if(s.settings.music&&!musicTimer)music();let previousCombo=s.combo;let now=Date.now(),ms=2100+s.perks.momentum*135;s.combo=now-s.lastTap<ms?Math.min(s.combo+1,10000):1;s.lastTap=now;s.bestCombo=Math.max(s.bestCombo,s.combo);s.taps++;let lucky=Math.random()<Math.min(.75,.04+s.perks.crit*.025);if(lucky)s.crits++;let amount=tapValue()*(lucky?5:1);add(amount);fx(lucky?"crit":"tap");
if(lucky&&s.crits%9===0)window.DotMeme?.play("crit",s.settings.sound);
if(s.combo!==previousCombo&&[10,50,100,250,500,1000,2500,5000,10000].includes(s.combo)){
 const bonus=Math.max(50,Math.floor(tapValue()*s.combo*.8));add(bonus);
 const label="+"+fmt(bonus)+" bonus energy";
 window.DotMeme?.play("streak"+(s.combo>=500?500:s.combo),s.settings.sound);
 window.DotMeme?.moment(s.combo,label,s.settings.memes,true);
 toast("🔥 "+s.combo+" MANUAL TAPS · "+label);
 try{navigator.vibrate?.([15,30,40])}catch(e){}
 save();
}if(lucky)vibrate();let r=$("#particles").getBoundingClientRect(),x=ev?.clientX?ev.clientX-r.left:r.width/2,y=ev?.clientY?ev.clientY-r.top:r.height/2;fly(clamp(x,25,r.width-25),clamp(y,25,r.height-25),"+"+fmt(amount)+(lucky?" ✦":""),lucky);$("#orb").classList.add("pressed");clearTimeout(tap.timer);tap.timer=setTimeout(()=>$("#orb").classList.remove("pressed"),100);hud();awards()}
function toast(msg){$("#toast").textContent=msg;$("#toast").classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>$("#toast").classList.remove("show"),2600)}
function buy(i){let q=quote(i,qty);if(s.coins+1e-6<q.cost||!Number.isFinite(q.cost))return;let before=s.owned[i];s.coins=Math.max(0,s.coins-q.cost);s.owned[i]+=q.n;fx("buy");window.DotMeme?.play(i>4?"streak50":"purchase",s.settings.sound);if([10,25,50,100,200,400,800].some(x=>before<x&&s.owned[i]>=x)){fx("unlock");toast("✦ Production doubled!");window.DotMeme?.event("unlock",B[i][0]+" ×"+s.owned[i],s.settings.memes)}else if(!before&&i>0){toast("✦ "+B[i][0]+" unlocked");window.DotMeme?.event("unlock",B[i][0],s.settings.memes)}render();hud();awards();save()}
function upgrade(id){let u=U.find(x=>x[0]===id);if(!u||s.perks[id]>=u[6])return;let price=u[4]*Math.pow(u[5],s.perks[id]);if(s.coins+1e-8<price)return;s.coins=Math.max(0,s.coins-price);s.perks[id]++;fx("buy");window.DotMeme?.play("upgrade",s.settings.sound);render();hud();awards();save()}
function awards(){let found=[];for(let a of A)if(!s.awards.includes(a[0])&&a[4](s)){s.awards.push(a[0]);found.push(a)}if(found.length){fx("unlock");window.DotMeme?.play("achievement",s.settings.sound);window.DotMeme?.event("achievement",found[0][2],s.settings.memes);toast("🏆 "+found[0][2]+(found.length>1?" +"+(found.length-1):""));if(tab==="goals")render()}}
const chapters=["The beginning","First light","The workshop","Electric dreams","The skyline","The cosmos","Beyond the stars","The infinite"];
function hud(){let chapter=clamp(Math.floor(Math.log10(s.runEarned+1)/3),0,chapters.length-1);$("#coins").textContent=fmt(s.coins);$("#income").textContent=fmt(pps());$("#tapValue").textContent="+"+fmt(tapValue());$("#eraLabel").textContent="CHAPTER "+String(chapter+1).padStart(2,"0")+" · "+chapters[chapter].toUpperCase();$("#starLabel").textContent="✦ "+fmt(s.stars)+" stars";let now=Date.now(),active=now<s.driveEnd,remain=Math.max(0,Math.ceil((s.driveReady-now)/1000));$("#overdrive").disabled=active||remain>0;$("#overdrive").classList.toggle("hot",active);$("#overdriveState").textContent=active?"ACTIVE · "+Math.ceil((s.driveEnd-now)/1000)+"s":remain?"Ready in "+Math.ceil(remain/60)+"m "+remain%60+"s":"3× power · 20 sec";if(s.combo&&now-s.lastTap>2100+s.perks.momentum*135)s.combo=0;let targets=[10,50,100,250,500,1000,2500,5000,10000],next=targets.find(x=>x>s.combo);
let prev=[0,...targets].filter(x=>x<=s.combo).pop()||0;
$("#comboLabel").textContent=next?(s.combo>0?(next-s.combo)+" taps to next meme ✦":"Every tap counts."):"LEGENDARY ✦";
$("#comboAmount").textContent=s.combo+" manual streak";
$("#comboFill").style.width=next?clamp((s.combo-prev)/(next-prev)*100,0,100)+"%":"100%";$("#orb").classList.toggle("fever",active);$("#orb").classList.toggle("heat",s.combo>=10);$("#orb").classList.toggle("legend",s.combo>=50);$("#orb").classList.toggle("cosmic",s.combo>=100);$("#comboFill").classList.toggle("combo-gold",s.combo>=50);$("#soundToggle").classList.toggle("on",s.settings.sound);$("#soundToggle").textContent=s.settings.sound?"♪":"×";$("#musicToggle").classList.toggle("on",s.settings.music);$("#musicToggle").textContent=s.settings.music?"♫":"♩"}
function setTab(t){tab=t;$$(".tab").forEach(e=>e.classList.toggle("active",e.dataset.tab===t));$$(".tab-panel").forEach(e=>e.classList.toggle("active",e.id===t+"Panel"));let names={build:"Make it grow",lab:"Get powerful",goals:"Little victories",more:"The big picture"},icons={build:"↗",lab:"✳",goals:"✦",more:"∞"};$("#sectionTitle").textContent=names[t]+".";$("#sectionIcon").textContent=icons[t];render()}
function renderBuild(){let html="",hidden=0,highest=s.owned.reduce((a,v,i)=>v?i:a,0);for(let i=0;i<B.length;i++){let b=B[i];if(i>highest+3&&s.runEarned<b[3]*.2){hidden++;continue}let q=quote(i,qty),ok=s.coins+1e-7>=q.cost&&Number.isFinite(q.cost),rate=b[4]*s.owned[i]*milestone(s.owned[i])*permanent()*Math.pow(1.25,s.perks.boost)*boost();html+='<article class="build-card '+(ok?"affordable":"")+'"><div class="item-icon" style="--bg:'+b[2]+'">'+b[1]+'</div><div class="item-main"><div class="item-title">'+b[0]+' <span class="item-owned">×'+fmt(s.owned[i])+'</span></div><div class="item-description">'+b[6]+'</div><div class="item-output">'+(s.owned[i]?"+"+fmt(rate)+"/s total":"+"+fmt(b[4]*permanent())+"/s each")+'</div></div><button class="buy-btn" data-buy="'+i+'" '+(!ok?"disabled":"")+'><strong>'+fmt(q.cost)+'</strong><small>BUY '+(qty==="max"?"MAX":"×"+q.n)+'</small></button></article>'}$("#buildings").innerHTML=html;$("#buildingsNote").textContent=hidden?hidden+" more discoveries waiting ✦":"You found every production tier. ✦"}
function renderLab(){$("#upgrades").innerHTML=U.map(u=>{let n=s.perks[u[0]],max=n>=u[6],price=u[4]*Math.pow(u[5],n),ok=s.coins>=price&&!max;return '<article class="build-card '+(ok?"affordable":"")+'"><div class="item-icon">'+u[1]+'</div><div class="item-main"><div class="item-title">'+u[2]+' <span class="item-owned">Lv '+n+'</span></div><div class="item-description">'+u[3]+'</div></div><button class="buy-btn" data-perk="'+u[0]+'" '+(!ok?"disabled":"")+'><strong>'+(max?"MAX":fmt(price))+'</strong><small>'+(max?"DONE":"UPGRADE")+'</small></button></article>'}).join("")}
function today(d=new Date()){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function daily(){if(s.dailyDate===today())return;let y=new Date();y.setDate(y.getDate()-1);s.dailyStreak=s.dailyDate===today(y)?s.dailyStreak+1:1;s.dailyDate=today();s.dailyClaims++;window.DotMeme?.play("daily",s.settings.sound);window.DotMeme?.event("daily","Come back tomorrow ✦",s.settings.memes);let value=Math.max(75,pps()/boost()*120)*Math.min(3,1+(s.dailyStreak-1)*.1);add(value);fx("unlock");toast("🎁 Daily gift: +"+fmt(value));render();hud();awards();save()}
function renderGoals(){let claimed=s.dailyDate===today();$("#dailyCard").innerHTML='<div class="daily-card"><div class="daily-kicker">A LITTLE PRESENT 🎁</div><div class="daily-title">Your daily spark.</div><div class="daily-desc">'+(claimed?"See you tomorrow · "+s.dailyStreak+" day streak":"Free energy · Day "+(s.dailyStreak+1))+'</div><button class="white-btn" id="claimDaily" '+(claimed?"disabled":"")+'>'+(claimed?"✓ Collected":"Claim gift ↗")+'</button></div>';$("#goalCount").textContent=s.awards.length+" / "+A.length;$("#achievements").innerHTML=A.map(a=>{let done=s.awards.includes(a[0]);return '<div class="goal '+(done?"done":"")+'"><div class="goal-icon">'+(done?a[1]:"🔒")+'</div><div class="goal-name">'+a[2]+'</div><div class="goal-desc">'+(done?"✓ Completed":a[3])+'</div></div>'}).join("")}
const prestigeGain=()=>Math.floor(Math.sqrt(s.runEarned/1000000));
function renderMore(){let gain=prestigeGain();$("#prestigeCard").innerHTML='<div class="prestige-card"><div class="daily-kicker">THE NEXT UNIVERSE ✦</div><div class="daily-title">Begin again. Grow faster.</div><div class="daily-desc">Reset energy, generators and lab. Keep achievements and +14% permanent power per star.<br>Current bonus: ×'+permanent().toFixed(2)+'</div><button class="white-btn" id="prestige" '+(!gain?"disabled":"")+'>'+(gain?"Ascend · +"+fmt(gain)+" stars ↗":"Earn 1M this run to ascend")+'</button></div>';let stats=[["TOTAL EARNED",fmt(s.lifetime)],["TAPS",fmt(s.taps)],["BEST COMBO",fmt(s.bestCombo)],["GENERATORS",fmt(ownedTotal(s))],["PRESTIGES",fmt(s.prestiges)],["STARS",fmt(s.stars)],["LUCKY HITS",fmt(s.crits)],["ACHIEVEMENTS",s.awards.length+"/"+A.length],["METEORS",fmt(s.meteors)],["PLAY TIME",fmt(Math.floor(s.playMs/60000))+" min"]];$("#stats").innerHTML=stats.map(x=>'<div class="stat"><strong>'+x[1]+'</strong><small>'+x[0]+'</small></div>').join("");$("#toggleParticles").innerHTML='Visual effects <strong>'+(s.settings.particles?"ON":"OFF")+'</strong>';
$("#toggleMemes").innerHTML='Meme reactions <strong>'+(s.settings.memes?"ON":"OFF")+'</strong>'}
function render(){if(tab==="build")renderBuild();else if(tab==="lab")renderLab();else if(tab==="goals")renderGoals();else renderMore()}
function overdrive(){let n=Date.now();if(n<s.driveReady||n<s.driveEnd)return;s.driveEnd=n+20000;s.driveReady=n+150000;s.boosts++;fx("boost");window.DotMeme?.play("boost",s.settings.sound);vibrate();toast("⚡ OVERDRIVE! 3× everything");hud();render();awards();save()}
function meteorTick(){let n=Date.now(),e=$("#meteor");if(!e.classList.contains("hidden")&&n>meteorEnd){e.classList.add("hidden");nextMeteor=n+45000+Math.random()*45000}if(n>=nextMeteor&&e.classList.contains("hidden")){nextMeteor=Infinity;meteorEnd=n+12000;e.classList.remove("hidden");e.style.right=(8+Math.random()*12)+"%";e.style.top=(12+Math.random()*22)+"%"}}
function catchMeteor(){let e=$("#meteor");if(e.classList.contains("hidden"))return;e.classList.add("hidden");nextMeteor=Date.now()+48000+Math.random()*60000;s.meteors++;window.DotMeme?.play("meteor",s.settings.sound);window.DotMeme?.event("meteor","Rare lucky catch!",s.settings.memes);let amount=Math.max(125,pps()/boost()*75);add(amount);fx("unlock");vibrate();toast("☄️ Shooting star! +"+fmt(amount));let r=$("#particles").getBoundingClientRect();fly(r.width*.7,r.height*.27,"+"+fmt(amount),true);hud();render();awards();save()}
function modal(symbol,title,description,button,action){$("#modalSymbol").textContent=symbol;$("#modalTitle").textContent=title;$("#modalText").textContent=description;$("#modalConfirm").textContent=button;modalAction=action;$("#modal").classList.remove("hidden");$("#modalCancel").focus()}
function closeModal(){$("#modal").classList.add("hidden");modalAction=null}
function ascend(){let gain=prestigeGain();if(!gain)return;modal("✦","A new beginning?","Reset current energy, generators and upgrades for "+gain+" permanent stars. Keep achievements and lifetime stats.","Ascend ✦",()=>{let keep={lifetime:s.lifetime,taps:s.taps,bestCombo:s.bestCombo,prestiges:s.prestiges+1,stars:s.stars+gain,awards:s.awards,crits:s.crits,boosts:s.boosts,meteors:s.meteors,dailyClaims:s.dailyClaims,dailyStreak:s.dailyStreak,dailyDate:s.dailyDate,created:s.created,playMs:s.playMs,settings:s.settings};s=Object.assign(blank(),keep);fx("unlock");window.DotMeme?.play("prestige",s.settings.sound);window.DotMeme?.event("prestige","A fresh universe ✦",s.settings.memes);closeModal();toast("✦ +"+gain+" stars · New universe");awards();save();hud();render()})}
function exportSave(){save();let blob=new Blob([JSON.stringify(s,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="dot-game-save.json";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),4000);toast("Save exported")}
function importSave(file){if(!file)return;let reader=new FileReader();reader.onload=()=>{try{let x=JSON.parse(String(reader.result));if(x.v!==1||!Array.isArray(x.owned))throw Error("Invalid");modal("↥","Import this save?","This will replace your current progress.","Import save",()=>{localStorage.setItem(KEY,JSON.stringify(x));closeModal();s=blank();load();music();hud();render();toast("Save imported ✓")})}catch(e){toast("Invalid save file")}};reader.readAsText(file);$("#importInput").value=""}
function offline(){let n=Date.now(),secs=clamp((n-s.saved)/1000,0,8*3600);if(secs>10){let rate=pps()/(Date.now()<s.driveEnd?3:1),part=clamp(.35+s.perks.offline*.08,.35,.95),sum=rate*secs*part;if(sum>=1){add(sum);toast("🌙 While away: +"+fmt(sum))}}s.saved=n}
function bind(){
 $("#orb").addEventListener("pointerdown",tap);$("#orb").addEventListener("click",e=>{if(e.detail===0)tap(e)});$("#meteor").addEventListener("click",catchMeteor);$("#overdrive").addEventListener("click",overdrive);
 $("#soundToggle").addEventListener("click",()=>{s.settings.sound=!s.settings.sound;if(s.settings.sound){wakeAudio();fx("buy")}hud();save()});
 $("#musicToggle").addEventListener("click",()=>{s.settings.music=!s.settings.music;wakeAudio();music();hud();save()});
 $$(".tab").forEach(e=>e.addEventListener("click",()=>setTab(e.dataset.tab)));
 $$(".quantity button").forEach(e=>e.addEventListener("click",()=>{qty=e.dataset.qty==="max"?"max":Number(e.dataset.qty);$$(".quantity button").forEach(b=>b.classList.toggle("selected",b===e));render()}));
 $("#buildings").addEventListener("click",e=>{let b=e.target.closest("[data-buy]");if(b)buy(Number(b.dataset.buy))});
 $("#upgrades").addEventListener("click",e=>{let b=e.target.closest("[data-perk]");if(b)upgrade(b.dataset.perk)});
 $("#dailyCard").addEventListener("click",e=>{if(e.target.closest("#claimDaily"))daily()});
 $("#prestigeCard").addEventListener("click",e=>{if(e.target.closest("#prestige"))ascend()});
 $("#toggleParticles").addEventListener("click",()=>{s.settings.particles=!s.settings.particles;render();save()});$("#toggleMemes").addEventListener("click",()=>{s.settings.memes=!s.settings.memes;render();save()});
 $("#exportSave").addEventListener("click",exportSave);
 $("#importSave").addEventListener("click",()=>$("#importInput").click());
 $("#importInput").addEventListener("change",e=>importSave(e.target.files?.[0]));
 $("#resetSave").addEventListener("click",()=>modal("↺","Start from zero?","This permanently clears progress on this device. Export a backup if needed.","Reset everything",()=>{s=blank();save();closeModal();hud();render();toast("Fresh start ✨")}));
 $("#modalCancel").addEventListener("click",closeModal);$("#modalConfirm").addEventListener("click",()=>modalAction?.());$("#modal").addEventListener("click",e=>{if(e.target.id==="modal")closeModal()});
 document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal();if((e.code==="Space"||e.code==="Enter")&&!e.repeat&&document.activeElement===document.body&&$("#modal").classList.contains("hidden")){e.preventDefault();tap()}});
 document.addEventListener("visibilitychange",()=>{if(document.hidden)save();else{offline();render();hud()}});
 window.addEventListener("pagehide",save);window.addEventListener("beforeunload",save);
}
load();bind();offline();awards();setTab("build");hud();
let last=Date.now(),visual=0,refresh=0,saveTimer=0;
setInterval(()=>{let n=Date.now(),dt=clamp((n-last)/1000,0,.5);last=n;if(document.hidden)return;add(pps()*dt);s.playMs+=dt*1000;meteorTick();visual+=dt;refresh+=dt;saveTimer+=dt;if(visual>=.12){hud();visual=0}if(refresh>=1.2){if(tab==="build"||tab==="lab")render();refresh=0}if(saveTimer>=3){save();awards();saveTimer=0}},100);
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
})();