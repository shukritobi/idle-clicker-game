// Original pixel-art reaction GIFs. No outside GIF hosts or API keys.
// Run: node scripts/create-reactions.cjs
const fs=require("node:fs"),path=require("node:path");
const OUT=path.join(__dirname,"..","assets","reactions");fs.mkdirSync(OUT,{recursive:true});
const W=120,H=104,P=["#f6f2ff","#6354ce","#ffffff","#f5ac7e","#26253e","#f9d371","#a2e2f4","#d9a9ef","#a0d98f","#ff829b","#e8dcff","#8b80e8","#ffe8be","#5c4474","#b9f1e0","#efa0bd"];
function color(s){return [1,3,5].map(i=>parseInt(s.slice(i,i+2),16))}
function canvas(){
 const pixels=new Uint8Array(W*H);
 const put=(x,y,c)=>{x=Math.round(x);y=Math.round(y);if(x>=0&&y>=0&&x<W&&y<H)pixels[y*W+x]=c};
 const rect=(x,y,w,h,c)=>{for(let j=Math.floor(y);j<y+h;j++)for(let i=Math.floor(x);i<x+w;i++)put(i,j,c)};
 const ellipse=(cx,cy,rx,ry,c)=>{for(let y=Math.floor(cy-ry);y<=cy+ry;y++)for(let x=Math.floor(cx-rx);x<=cx+rx;x++)if(((x-cx)/rx)**2+((y-cy)/ry)**2<=1)put(x,y,c)};
 const line=(x0,y0,x1,y1,c,t=2)=>{let n=Math.max(1,Math.ceil(Math.hypot(x1-x0,y1-y0)*2));for(let i=0;i<=n;i++){let v=i/n;rect(x0+(x1-x0)*v-t/2,y0+(y1-y0)*v-t/2,t,t,c)}};
 const spark=(x,y,c,r=5)=>{rect(x-r/2,y-1,r,2,c);rect(x-1,y-r/2,2,r,c)};
 return{pixels,rect,ellipse,line,spark};
}
function frame(kind,t){
 const a=canvas(),{rect,ellipse,line,spark}=a,w=Math.sin(t*Math.PI/4),flip=t%2===0;
 ellipse(60,92,37,5,10);ellipse(60,50,48,46,10);ellipse(60,49,44,42,0);
 for(let j=0;j<5;j++)spark((17+j*21+7*t)%110+5,12+((t*8+j*16)%77),j%2?5:11,3+(j%3)*2);
 if(kind===0){
  ellipse(60+w*4,59,27,25,2);ellipse(41+w*4,38,12,18,2);ellipse(79+w*4,38,12,18,2);
  ellipse(60+w*4,56,23,23,12);rect(45+w*4,53,30,8,12);
  ellipse(51+w*4,55,3,4,4);ellipse(68+w*4,55,3,4,4);ellipse(60+w*4,64,4,2,9);
  line(38,73,25,75+w*7,3,5);line(81,72,95,64-w*7,3,5);
  line(53,82,48+w*8,91,4,4);line(69,82,74-w*8,91,4,4);
  spark(20,26,5,8);spark(97,78,9,7);
 }else if(kind===1){
  ellipse(60,72,25,23,3);rect(42,72,36,14,2);ellipse(60,48,23,24,12);
  ellipse(60,35,30,16,2);rect(34,34,52,16,2);rect(36,46,48,5,11);
  ellipse(51,58,3,4,4);ellipse(70,58,3,4,4);ellipse(61,69,7,4,9);
  line(42,73,18,62,3,6);line(81,73,92,56,3,6);ellipse(93,57,12,4,4);ellipse(95,53,14,3,1);
  if(flip)ellipse(95,40,7,6,5);else ellipse(105,36,7,6,5);
  for(let i=0;i<3;i++)line(22+i*9,42+w*3,20+i*9,29+w*2,6,2);
 }else if(kind===2){
  ellipse(60,78,29,17,1);ellipse(60,51,25,27,3);ellipse(60,37,32+w*2,24+w*2,7);
  for(let i=0;i<8;i++){let p=i/8*Math.PI*2+t*.1;line(60+Math.cos(p)*26,37+Math.sin(p)*19,60+Math.cos(p)*42,37+Math.sin(p)*33,i%2?9:5,3)}
  for(let i=0;i<5;i++)ellipse(43+i*8+(i%2)*2,37+Math.sin(t*.9+i)*6,6,7,i%2?11:15);
  ellipse(51,57,3,4,4);ellipse(70,57,3,4,4);rect(54,68,14,2,4);
 }else if(kind===3){
  rect(40,58,42,29,4);rect(45,62,33,23,3);ellipse(60,50,20,24,12);ellipse(52,50,3,3,4);ellipse(70,50,3,3,4);rect(53,62,15,2,4);
  line(39,76,21,71+w*10,1,6);line(83,76,104,72-w*10,1,6);
  rect(37,14,51,25,4);rect(42,20,41,16,2);for(let i=0;i<4;i++)rect(44+i*10,20,5,6,i%2?3:1);rect(37,11,51,8,1);line(43,10,81,0,4,5);
 }else{
  ellipse(60,75,24,22,1);ellipse(60,53,25,25,12);ellipse(51,56,4,3,4);ellipse(70,56,4,3,4);ellipse(60,68,10,3,4);
  rect(36,34,49,12,5);line(38,34,29,15-t%4,5,9);line(49,34,48,8+t%3,5,8);
  line(60,34,61,5,5,8);line(73,34,76,8,5,8);line(82,34,91,15+t%4,5,9);
  for(let i=0;i<8;i++){let p=i*Math.PI/4+t*.15;spark(60+Math.cos(p)*45,53+Math.sin(p)*38,i%2?9:5,8)}
 }
 return a.pixels;
}
function compress(indices,min=4){
 const clear=1<<min,end=clear+1;let dict,next,size,buf=0,bits=0,out=[];
 const reset=()=>{dict=new Map();for(let i=0;i<clear;i++)dict.set(String(i),i);next=end+1;size=min+1};
 const emit=c=>{buf|=c<<bits;bits+=size;while(bits>=8){out.push(buf&255);buf>>>=8;bits-=8}};
 reset();emit(clear);let word=String(indices[0]);
 for(let i=1;i<indices.length;i++){let k=indices[i],wk=word+","+k;
  if(dict.has(wk)){word=wk;continue}
  emit(dict.get(word));
  if(next<4096){dict.set(wk,next++);if(next>(1<<size)&&size<12)size++}else{emit(clear);reset()}
  word=String(k);
 }
 emit(dict.get(word));emit(end);if(bits)out.push(buf&255);
 let blocks=[];for(let i=0;i<out.length;i+=255){let b=out.slice(i,i+255);blocks.push(b.length,...b)}blocks.push(0);return blocks;
}
function makeGif(kind){
 let arr=[],add=(...xs)=>arr.push(...xs),le=n=>[n&255,(n>>8)&255];
 add(...Buffer.from("GIF89a"),...le(W),...le(H),0xf3,0,0);
 for(let c of P)add(...color(c));
 add(0x21,0xff,11,...Buffer.from("NETSCAPE2.0"),3,1,0,0,0);
 for(let t=0;t<10;t++){add(0x21,0xf9,4,0x04,9,0,0,0);add(0x2c,0,0,0,0,...le(W),...le(H),0);add(4,...compress(frame(kind,t)))}
 add(0x3b);return Buffer.from(arr);
}
["streak-10","streak-50","streak-100","streak-250","streak-500"].forEach((name,i)=>{
 const bytes=makeGif(i),p=path.join(OUT,name+".gif");fs.writeFileSync(p,bytes);console.log("Created",p,bytes.length,"bytes");
});
