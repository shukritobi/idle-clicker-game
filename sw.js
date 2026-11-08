const CACHE="dot-offline-v2";
const CORE=["./","./index.html","./style.css","./meme.js","./game.js","./icon.svg","./manifest.webmanifest"];
const OPTIONAL=[
 "./assets/reactions/streak-10.gif",
 "./assets/reactions/streak-50.gif",
 "./assets/reactions/streak-100.gif",
 "./assets/reactions/streak-250.gif",
 "./assets/reactions/streak-500.gif",
 "./assets/audio/coins.ogg",
 "./assets/audio/switch.ogg",
 "./assets/audio/success.ogg",
 "./assets/audio/metal.ogg",
 "./assets/audio/explosion.ogg"
];
self.addEventListener("install",event=>{
 event.waitUntil(caches.open(CACHE).then(async cache=>{
  await cache.addAll(CORE);
  await Promise.allSettled(OPTIONAL.map(asset=>cache.add(asset)));
 }));
 self.skipWaiting();
});
self.addEventListener("activate",event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))));
 self.clients.claim();
});
self.addEventListener("fetch",event=>{
 if(event.request.method!=="GET"||new URL(event.request.url).origin!==self.location.origin)return;
 event.respondWith(fetch(event.request).then(response=>{
  if(response.ok){const copy=response.clone();caches.open(CACHE).then(c=>c.put(event.request,copy))}
  return response;
 }).catch(()=>caches.match(event.request).then(r=>r||((event.request.mode==="navigate")?caches.match("./index.html"):Response.error()))));
});
