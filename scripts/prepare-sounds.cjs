// Download only pre-reviewed CC0 Kenney OGG sound effects for the published game.
// Sources: https://github.com/GeorgeQLe/assets-sfx-ui and /assets-sfx-combat
// Original packs: https://kenney.nl/assets; license: CC0 1.0.
// If unavailable at build time, the game's procedural fallback still plays.
const fs=require("node:fs"),path=require("node:path");
const output=path.join(__dirname,"..","assets","audio");fs.mkdirSync(output,{recursive:true});
const files={
 "coins.ogg":"GeorgeQLe/assets-sfx-combat/main/assets/kenney/rpg-audio/Audio/handleCoins2.ogg",
 "switch.ogg":"GeorgeQLe/assets-sfx-ui/main/assets/kenney/interface-sounds/Audio/switch_003.ogg",
 "success.ogg":"GeorgeQLe/assets-sfx-ui/main/assets/kenney/interface-sounds/Audio/confirmation_004.ogg",
 "metal.ogg":"GeorgeQLe/assets-sfx-combat/main/assets/kenney/impact-sounds/Audio/impactMetal_heavy_002.ogg",
 "explosion.ogg":"GeorgeQLe/assets-sfx-combat/main/assets/kenney/sci-fi-sounds/Audio/explosionCrunch_003.ogg"
};
async function get(name,source){
 const destination=path.join(output,name);
 if(fs.existsSync(destination)&&fs.statSync(destination).size>100)return;
 const response=await fetch("https://raw.githubusercontent.com/"+source,{signal:AbortSignal.timeout(20000)});
 if(!response.ok)throw new Error(response.status+" "+name);
 const data=Buffer.from(await response.arrayBuffer());
 if(data.length<100||data.toString("utf8",0,4)!=="OggS")throw new Error("Invalid OGG: "+name);
 fs.writeFileSync(destination,data);console.log("Prepared",name,data.length,"bytes");
}
Promise.allSettled(Object.entries(files).map(([n,src])=>get(n,src))).then(results=>{
 for(let i=0;i<results.length;i++)if(results[i].status==="rejected")console.warn("Optional audio unavailable:",Object.keys(files)[i],String(results[i].reason));
});
