/* dot. meme director: locally hosted CC0 Kenney samples + original synth cues.
   No third-party copyrighted meme recordings are included. */
(()=>{"use strict";
const GIFS={
10:["LET HIM COOK","Smug dancing cat","streak-10.gif","😼"],
50:["BRO IS LOCKED IN","The chef goes wild","streak-50.gif","👨‍🍳"],
100:["GALAXY BRAIN","Brain expanding","streak-100.gif","🧠"],
250:["ABSOLUTE CINEMA","Big-screen moment","streak-250.gif","🎬"],
500:["HE IS HIM","Crowned champion","streak-500.gif","👑"]
};
const clips={
purchase:["coins.ogg",.21],upgrade:["switch.ogg",.26],
achievement:["success.ogg",.28],unlock:["success.ogg",.32],
crit:["metal.ogg",.10],daily:["success.ogg",.3],
meteor:["coins.ogg",.35],boost:["explosion.ogg",.22],
prestige:["explosion.ogg",.28],
streak50:["metal.ogg",.30],
streak100:["explosion.ogg",.34],streak250:["explosion.ogg",.34],
streak500:["explosion.ogg",.38]
};
let ctx=null,active=null,hideTimer=0,recent=0,audioUnlocked=false;
const reduced=()=>window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
function context(){try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;if(!ctx)ctx=new C();if(ctx.state==="suspended")ctx.resume().catch(()=>{});return ctx}catch(e){return null}}
function tone(f,d=.17,delay=0,wave="sine",amp=.065,drop=0){
 const c=context();if(!c)return;
 try{const t=c.currentTime+delay,osc=c.createOscillator(),gain=c.createGain();
 osc.type=wave;osc.frequency.setValueAtTime(f,t);
 if(drop)osc.frequency.exponentialRampToValueAtTime(Math.max(30,f*drop),t+d);
 gain.gain.setValueAtTime(.0001,t);
 gain.gain.exponentialRampToValueAtTime(amp,t+.018);
 gain.gain.exponentialRampToValueAtTime(.0001,t+d);
 osc.connect(gain);gain.connect(c.destination);osc.start(t);osc.stop(t+d+.02);
 }catch(e){}
}
function synth(type){
 if(type==="streak10"){[330,440,554].forEach(f=>tone(f,.28,0,"sawtooth",.019));tone(880,.19,.22,"square",.017)}
 else if(type==="streak50"){tone(200,.5,0,"sine",.14,.19);tone(145,.35,.12,"triangle",.065,.45)}
 else if(type==="streak100"){[440,554,659,880].forEach((f,i)=>tone(f,.23,i*.1,"triangle",.056));tone(120,.5,.27,"sine",.13,.24)}
 else if(type==="streak250"){[392,523,659,784,1046].forEach((f,i)=>tone(f,.19,i*.085,"sawtooth",.019))}
 else if(type==="streak500"){tone(150,.55,0,"sine",.13,.18);[523,659,784,1046,1318].forEach((f,i)=>tone(f,.31,.14+i*.095,"triangle",.053))}
 else if(type==="prestige"){tone(96,.8,0,"sine",.10,.3);[329,440,659,880,1046].forEach((f,i)=>tone(f,.36,.18+i*.12,"sine",.04))}
 else if(type==="achievement"||type==="unlock"){[523,659,784].forEach((f,i)=>tone(f,.17,i*.09,"triangle",.03))}
 else if(type==="boost"){tone(160,.48,0,"sawtooth",.025,.24);tone(880,.28,.19,"triangle",.03)}
 else if(type==="purchase"){tone(392,.11,0,"sine",.025);tone(587,.14,.08,"triangle",.02)}
 else if(type==="upgrade"){tone(392,.10,0,"triangle",.02);tone(784,.16,.1,"triangle",.035)}
 else if(type==="daily"||type==="meteor"){[523,784,1046].forEach((f,i)=>tone(f,.18,i*.08,"sine",.037))}
 else if(type==="crit"){tone(100,.23,0,"sine",.065,.5)}
}
function play(type,enabled=true){
 if(!enabled)return;
 audioUnlocked=true;
 // Meme-style synthetic layer always works offline, including if a sample cannot load.
 synth(type);
 const item=clips[type];
 if(!item)return;
 try{const a=new Audio("./assets/audio/"+item[0]);a.volume=item[1];a.preload="auto";a.play().catch(()=>{});a.addEventListener("ended",()=>{a.src=""},{once:true})}catch(e){}
}
function ensure(){
 let e=document.getElementById("memeMoment");
 if(e)return e;
 e=document.createElement("div");
 e.id="memeMoment";e.className="meme-moment";
 e.setAttribute("aria-live","polite");e.setAttribute("aria-atomic","true");
 e.innerHTML='<div class="meme-inner"><div class="meme-mini">NEW MEME MOMENT</div><img class="meme-gif" alt="" width="120" height="104"><div class="meme-fallback">✦</div><div class="meme-title"></div><div class="meme-extra"></div><div class="meme-shine">✦ ✳ ✦</div></div>';
 document.body.appendChild(e);return e;
}
function moment(tier,extra="",enabled=true,force=false){
 if(!enabled)return;
 const now=Date.now();
 if(!force&&now-recent<2300)return;
 recent=now;
 let k=[500,250,100,50,10].find(x=>tier>=x)||10,entry=GIFS[k],panel=ensure();
 clearTimeout(hideTimer);panel.classList.remove("visible");void panel.offsetWidth;
 panel.querySelector(".meme-mini").textContent=tier+" TAP STREAK · UNLOCKED";
 panel.querySelector(".meme-title").textContent=entry[0];
 panel.querySelector(".meme-extra").textContent=extra;
 let img=panel.querySelector(".meme-gif");
 img.style.display=reduced()?"none":"block";
 img.alt=entry[1];img.onerror=()=>{img.style.display="none";panel.classList.add("use-fallback")};
 img.src="./assets/reactions/"+entry[2];
 panel.querySelector(".meme-fallback").textContent=entry[3];
 panel.classList.toggle("reduced",reduced());panel.classList.add("visible");active=panel;
 hideTimer=setTimeout(()=>{panel.classList.remove("visible");active=null},reduced()?1200:2600);
}
function event(name,extra="",enabled=true){
 if(!enabled||Date.now()-recent<2900)return;
 const map={achievement:["ACHIEVEMENT UNLOCKED","GALAXY BRAIN",100],unlock:["NEW DISCOVERY","LET HIM COOK",50],prestige:["NEW UNIVERSE","HE IS HIM",500],daily:["DAILY GIFT","LET HIM COOK",10],meteor:["SHOOTING STAR","ABSOLUTE CINEMA",250]};
 const q=map[name];if(!q)return;
 moment(q[2],extra,enabled);if(active){active.querySelector(".meme-mini").textContent=q[0];active.querySelector(".meme-title").textContent=q[1]}
}
window.DotMeme={play,moment,event,resetAudio(){audioUnlocked=false}};
})();
