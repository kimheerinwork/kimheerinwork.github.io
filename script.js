(function(){
"use strict";
const projects=Array.isArray(window.PORTFOLIO_PROJECTS)?window.PORTFOLIO_PROJECTS:[];
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const pad=n=>String(n+1).padStart(2,"0");
const viewport=$("#canvas-viewport"),world=$("#canvas-world"),canvas=$("#project-canvas");
const intro=$("#intro"),pile=$("#intro-pile"),prompt=$("#intro-prompt"),skip=$("#intro-skip");
const overlay=$("#project-overlay"),overlayContent=$("#overlay-content"),overlayNumber=$("#overlay-number"),overlayClose=$("#overlay-close");
const WORLD={w:4000,h:2800};let camera={x:0,y:0,scale:1},drag=null,lastFocus=null,introState="INITIAL",introTimer=0;
const defaultCanvas=[{x:520,y:420,size:"hero",rotation:-1.5},{x:1760,y:330,size:"medium",rotation:2},{x:2850,y:620,size:"wide",rotation:-1},{x:1180,y:1660,size:"portrait",rotation:1.2},{x:2540,y:1770,size:"large",rotation:-2}];
function titleHTML(p){return `${p.title}${p.subtitle?`<span>${p.subtitle}</span>`:""}`}
function safeImage(img){img.addEventListener("error",()=>{const box=img.parentElement;img.remove();box.classList.add("image-missing");box.setAttribute("data-message","IMAGE NOT AVAILABLE")},{once:true})}
function renderProjects(){
 canvas.innerHTML=projects.map((p,i)=>`<article class="canvas-item"><button type="button" data-project="${p.id}" aria-label="Open ${p.title} project"><p class="grid-number">${pad(i)}</p><div class="grid-frame"><div class="canvas-image"><img src="${p.cover}" alt="${p.coverAlt||p.title}" decoding="async"></div></div><div class="canvas-meta"><h2>${titleHTML(p)}</h2><p class="side">${p.category}<br>${p.year}</p><p class="grid-view">VIEW PROJECT →</p></div></button></article>`).join("");
 $("#mobile-projects").innerHTML=projects.map((p,i)=>`<article class="mobile-item"><div class="mobile-heading"><p>${pad(i)}</p><h2>${titleHTML(p)}</h2><p>${p.year}</p></div><button class="mobile-thumb" type="button" data-project="${p.id}" aria-label="Open ${p.title} project"><img src="${p.cover}" alt="${p.coverAlt||p.title}" loading="lazy" decoding="async"></button><p class="mobile-category">${p.category}</p></article>`).join("");
 $$(`img`,canvas).concat($$("#mobile-projects img")).forEach(safeImage);renderMinimap();renderArchive();
}
function initialCamera(){camera={x:0,y:0,scale:1};world.style.transform="none"}
function applyCamera(){world.style.transform=`translate3d(${camera.x}px,${camera.y}px,0) scale(${camera.scale})`;updateMinimap()}
function clampScale(v){return Math.max(.22,Math.min(1.7,v))}
function zoomAt(next,cx=innerWidth/2,cy=innerHeight/2){const old=camera.scale,newScale=clampScale(next);camera.x=cx-(cx-camera.x)*(newScale/old);camera.y=cy-(cy-camera.y)*(newScale/old);camera.scale=newScale;applyCamera()}
function renderMinimap(){const dots=$("#minimap-dots");dots.innerHTML=projects.map(p=>{const c=p.canvas||{};return `<b style="left:${((c.x||0)/WORLD.w)*100}%;top:${((c.y||0)/WORLD.h)*100}%"></b>`}).join("")}
function updateMinimap(){const v=$("#minimap-view");if(!v)return;const w=Math.min(100,(innerWidth/(WORLD.w*camera.scale))*100),h=Math.min(100,(innerHeight/(WORLD.h*camera.scale))*100);v.style.width=w+"%";v.style.height=h+"%";v.style.left=Math.max(0,Math.min(100-w,(-camera.x/(WORLD.w*camera.scale))*100))+"%";v.style.top=Math.max(0,Math.min(100-h,(-camera.y/(WORLD.h*camera.scale))*100))+"%"}
function beginIntro(){
 if(innerWidth<768||matchMedia("(prefers-reduced-motion: reduce)").matches||sessionStorage.getItem("portfolioIntroPlayedV22")){finishIntro(true);return}
 introState="FALLING";pile.innerHTML=projects.slice(0,8).map((p,i)=>{
   const width=Math.min(310,Math.max(220,innerWidth*.22));
   const spread=Math.min(innerWidth*.15,190);
   const x=[-.85,.55,-.38,.8,0,-.65,.35,0][i%8]*spread-width/2;
   const y=-Math.min(innerHeight*.28,220)-i*16;
   const r=[-6,5,-3,6,-1,3,-4,2][i%8],tilt=[57,53,49,46,42,40,38,36][i%8];
   return `<div class="intro-card falling" style="width:${width}px;--delay:${.8+i*.45}s;--duration:${1.35+(i%3)*.12}s;--start-x:${x*1.2}px;--start-r:${r}deg;--pile-x:${x}px;--pile-y:${y}px;--pile-r:${r}deg;--pile-tilt:${tilt}deg;z-index:${i+1}"><img src="${p.cover}" alt=""></div>`
 }).join("");
 introTimer=setTimeout(()=>{introState="WAITING";intro.classList.add("waiting")},900+projects.slice(0,8).length*420+1250);
}
function finishIntro(immediate=false){
 if(introState==="READY"||introState==="DISPERSING")return;
 clearTimeout(introTimer);introState="DISPERSING";intro.classList.remove("waiting");
 const complete=()=>{introState="READY";intro.hidden=true;document.body.classList.remove("intro-active");document.body.classList.add("ready");try{sessionStorage.setItem("portfolioIntroPlayedV22","true")}catch{};};
 if(immediate||matchMedia("(prefers-reduced-motion: reduce)").matches){complete();return}
 const cards=$$(".intro-card",pile),targets=$$(".canvas-image",canvas);
 // Preserve each print's current pose, including a click during its fall.
 const poses=cards.map(card=>({transform:getComputedStyle(card).transform,w:card.offsetWidth,h:card.offsetHeight}));
 intro.classList.add("dispersing");
 const motions=cards.map((card,i)=>{
   const pose=poses[i],target=targets[i],item=target.closest(".canvas-item");
   const rect=target.getBoundingClientRect();
   const x=rect.left-innerWidth/2;
   const y=rect.top-innerHeight;
   const sx=target.offsetWidth*camera.scale/pose.w,sy=target.offsetHeight*camera.scale/pose.h;
   card.style.animation="none";card.style.transformOrigin="0 0";
   const end=`translate3d(${x}px,${y}px,0) rotate(0deg) scale(${sx},${sy})`;
   const flight=card.animate([{transform:pose.transform},{transform:pose.transform+" scale(.97)",offset:.07},{transform:`translate3d(${x+(i%2?45:-45)}px,${y-35}px,0) rotate(${i%2?3:-3}deg) scale(${sx*1.08},${sy*1.08})`,offset:.48},{transform:end}],{duration:2300+i*60,easing:"cubic-bezier(.22,.65,.25,1)",fill:"forwards"});
   return flight.finished.catch(()=>{});
 });
 Promise.all(motions).then(complete);
}
function renderArchive(){const cats=["ALL",...new Set(projects.flatMap(p=>p.category.split("/").map(v=>v.trim().toUpperCase())) )];$("#archive-filters").innerHTML=cats.map((c,i)=>`<button type="button" class="${i===0?"active":""}" data-filter="${c}">${c}</button>`).join("");filterArchive("ALL")}
function filterArchive(filter){$("#archive-index").innerHTML=projects.filter(p=>filter==="ALL"||p.category.toUpperCase().includes(filter)).map(p=>{const i=projects.indexOf(p);return `<button class="archive-row" type="button" data-project="${p.id}"><span>${pad(i)}</span><strong>${p.title}</strong><span>${p.category}</span><span>${p.year}</span></button>`}).join("")}
function paragraphs(text){return (text||"").split("\n\n").map(v=>`<p>${v}</p>`).join("")}
function openProject(p){
 hidePreview();
 const i=projects.indexOf(p),next=projects[(i+1)%projects.length];lastFocus=document.activeElement;sessionStorage.setItem("canvasState",JSON.stringify(camera));overlayNumber.textContent=`${pad(i)} / ${String(projects.length).padStart(2,"0")}`;
 overlayContent.innerHTML=`<header class="detail-head"><h1 id="overlay-title">${p.title}${p.subtitle?`<span>${p.subtitle}</span>`:""}</h1><dl class="detail-facts"><div><dt>YEAR</dt><dd>${p.date||p.year}</dd></div><div><dt>TYPE</dt><dd>${p.category}</dd></div>${p.award?`<div><dt>AWARD</dt><dd>${p.award}</dd></div>`:""}${p.participation?`<div><dt>ENTRY</dt><dd>${p.participation}</dd></div>`:""}<div><dt>TOOLS</dt><dd>${(p.tools||[]).join("<br>")}</dd></div>${p.bgm?`<div><dt>BGM</dt><dd>${p.bgm}</dd></div>`:""}</dl></header><div class="detail-cover"><img src="${p.cover}" alt="${p.coverAlt||p.title}"></div><div class="detail-description"><p>DESCRIPTION</p><section lang="ko"><h2>한국어 설명</h2>${paragraphs(p.descriptionKo||p.description)}</section><section lang="en"><h2>ENGLISH DESCRIPTION</h2>${paragraphs(p.descriptionEn||p.description)}</section></div><div class="detail-gallery" style="--detail-width:${p.detailFullBleed?"100%":p.detailWidth||"100%"}">${p.video?`<video controls playsinline preload="metadata" poster="${p.cover}"><source src="${p.video}" type="video/mp4"></video>`:""}${(p.images||[]).map((src,n)=>`<img src="${src}" alt="${p.title} project image ${n+1}" loading="lazy" decoding="async">`).join("")}</div><button class="next-project" type="button" data-project="${next.id}"><span>NEXT PROJECT</span><strong>${next.title} →</strong></button>`;
 overlay.hidden=false;document.body.style.overflow="hidden";overlay.scrollTop=0;setTimeout(()=>overlayClose.focus(),0);$$("img",overlayContent).forEach(safeImage);document.title=`${p.title} — KIM HEERIN`;
}
function closeProject(){overlay.hidden=true;overlayContent.innerHTML="";document.body.style.overflow="";document.title="KIM HEERIN — Visual Archive";lastFocus?.focus()}
function openPanel(id){const p=document.getElementById(id);if(!p)return;p.hidden=false;document.body.style.overflow="hidden";p.querySelector("[data-close-panel]")?.focus()}
function closePanels(){$$(`.side-panel`).forEach(p=>p.hidden=true);document.body.style.overflow=""}
const preview=document.createElement("aside");preview.className="preview-sheet";preview.setAttribute("aria-hidden","true");document.body.append(preview);
let previewTimer;
function hidePreview(){clearTimeout(previewTimer);preview.classList.remove("visible");document.body.classList.remove("previewing")}
function showPreview(p){if(introState!=="READY"||!overlay.hidden||!matchMedia("(pointer:fine)").matches)return;preview.innerHTML=`<p>${pad(projects.indexOf(p))}</p><h2>${p.title}</h2><img src="${p.cover}" alt=""><small>${p.category}<br>${p.year}</small><footer>VIEW PROJECT →</footer>`;preview.classList.add("visible");document.body.classList.add("previewing")}
document.addEventListener("pointerover",e=>{const target=e.target.closest("[data-project]");if(!target||canvas.contains(target)||target.contains(e.relatedTarget))return;hidePreview();const p=projects.find(p=>p.id===target.dataset.project);if(p)previewTimer=setTimeout(()=>showPreview(p),420)});
document.addEventListener("pointerout",e=>{const target=e.target.closest("[data-project]");if(target&&!target.contains(e.relatedTarget))hidePreview()});
renderProjects();initialCamera();beginIntro();
intro.addEventListener("click",e=>{if(e.target!==skip)finishIntro(false)});skip.addEventListener("click",()=>finishIntro(false));
// Measure unscaled frames: image scaling never changes the distance anchors.
let proximityTimer=0,proximityFrame=0,pointer=null;
const gridItems=$$(".canvas-item",canvas);
function resetProximity(){pointer=null;clearTimeout(proximityTimer);gridItems.forEach(item=>{item.style.setProperty("--proximity-scale",1);item.style.setProperty("--proximity-opacity",1);item.style.zIndex="";item.classList.remove("grid-near")})}
function updateProximity(){proximityFrame=0;if(!pointer)return;
 const distances=gridItems.map(item=>{const r=$(".grid-frame",item).getBoundingClientRect();return Math.hypot(pointer.x-r.left-r.width/2,pointer.y-r.top-r.height/2)});
 const nearest=Math.min(...distances);
 gridItems.forEach((item,i)=>{const d=distances[i],stops=[[0,1.45],[80,1.4],[180,1.25],[300,1],[450,.85],[650,.78]];let scale=.78;
 for(let n=1;n<stops.length;n++){if(d<=stops[n][0]){const [a,sa]=stops[n-1],[b,sb]=stops[n];const t=Math.max(0,(d-a)/(b-a));scale=sa+(sb-sa)*t;break}}
 item.style.setProperty("--proximity-scale",scale);item.style.setProperty("--proximity-opacity",d===nearest?1:.82);item.style.zIndex=d===nearest?"3":"1";item.classList.toggle("grid-near",d===nearest&&d<180);
 });
}
canvas.addEventListener("pointermove",e=>{if(introState!=="READY"||e.pointerType!=="mouse"||!matchMedia("(hover:hover) and (pointer:fine)").matches||matchMedia("(prefers-reduced-motion: reduce)").matches)return;pointer={x:e.clientX,y:e.clientY};clearTimeout(proximityTimer);proximityTimer=setTimeout(resetProximity,1600);if(!proximityFrame)proximityFrame=requestAnimationFrame(updateProximity)});
canvas.addEventListener("pointerleave",resetProximity);viewport.addEventListener("scroll",resetProximity,{passive:true});
canvas.addEventListener("focusin",e=>e.target.closest(".canvas-item")?.classList.add("grid-near"));canvas.addEventListener("focusout",resetProximity);
addEventListener("blur",resetProximity);
document.addEventListener("click",e=>{const projectEl=e.target.closest("[data-project]");if(projectEl){const p=projects.find(x=>x.id===projectEl.dataset.project);if(p)openProject(p);return}const panel=e.target.closest("[data-panel]");if(panel)openPanel(panel.dataset.panel);if(e.target.closest("[data-close-panel]"))closePanels();const filter=e.target.closest("[data-filter]");if(filter){$$("[data-filter]").forEach(b=>b.classList.toggle("active",b===filter));filterArchive(filter.dataset.filter)}const z=e.target.closest("[data-zoom]");if(z){if(z.dataset.zoom==="reset")initialCamera();else zoomAt(camera.scale*(z.dataset.zoom==="in"?1.18:.84))}});
overlayClose.addEventListener("click",closeProject);$("#minimap").addEventListener("click",initialCamera);
addEventListener("keydown",e=>{if(e.key==="Escape"){if(!overlay.hidden)closeProject();else closePanels()}if(e.key==="Enter"||e.key===" "){if(introState!=="READY")finishIntro(false)}});
addEventListener("resize",()=>{if(innerWidth<768){finishIntro(true)}updateMinimap()});
const cursor=$("#cursor");addEventListener("pointermove",e=>{cursor.style.left=e.clientX+"px";cursor.style.top=e.clientY+"px";const view=!!e.target.closest("[data-project]");cursor.classList.toggle("view",view);cursor.querySelector("span").textContent=view?"VIEW":""});
})();
