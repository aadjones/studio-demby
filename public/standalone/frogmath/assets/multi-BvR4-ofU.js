var G=Object.defineProperty;var H=(r,e,a)=>e in r?G(r,e,{enumerable:!0,configurable:!0,writable:!0,value:a}):r[e]=a;var h=(r,e,a)=>H(r,typeof e!="symbol"?e+"":e,a);import{c,g as j,p as W,l as $,b as X,a as _,d as Y,f as B,i as V,j as O,t as U,r as J,M as K,e as Q}from"./animation-KXmD0FeQ.js";import{a as Z,c as ee,w as te}from"./uiHelpers-DXpBluTm.js";import{s as ne,c as ae,a as oe,g as N,r as ie}from"./sharedStyle-D6osx98Y.js";import"./index-DD6DSve3.js";class re{constructor(){h(this,"particles",[]);h(this,"active",!1);h(this,"startTime",0);h(this,"duration",1500);h(this,"colors",["#ff6b6b","#4ecdc4","#45b7d1","#96ceb4","#feca57","#ff9ff3","#54a0ff","#5f27cd"])}createParticle(e,a){return{x:e,y:a,vx:(Math.random()-.5)*8,vy:Math.random()*-8-2,color:this.colors[Math.floor(Math.random()*this.colors.length)],size:Math.random()*6+3,rotation:Math.random()*Math.PI*2,rotationSpeed:(Math.random()-.5)*.3,life:0,maxLife:Math.random()*120+60}}start(){this.active=!0,this.particles=[],this.startTime=Date.now();for(let e=0;e<50;e++){const a=Math.random()*c.w,o=Math.random()*c.h*.3;this.particles.push(this.createParticle(a,o))}}update(){if(!this.active)return;const a=Date.now()-this.startTime>this.duration;if(!a&&Math.random()<.3&&this.particles.length<100){const o=Math.random()*c.w;this.particles.push(this.createParticle(o,-10))}for(let o=this.particles.length-1;o>=0;o--){const i=this.particles[o];i.x+=i.vx,i.y+=i.vy,i.vy+=.2,i.rotation+=i.rotationSpeed,i.life++,(i.life>i.maxLife||i.y>c.h+20)&&this.particles.splice(o,1)}a&&this.particles.length===0&&(this.active=!1)}draw(e){if(!(!this.active&&this.particles.length===0)){e.push();for(const a of this.particles){e.push(),e.translate(a.x,a.y),e.rotate(a.rotation);const o=Math.max(0,1-a.life/a.maxLife),i=e.color(a.color);i.setAlpha(o*255),e.fill(i),e.noStroke(),e.rectMode(e.CENTER),e.rect(0,0,a.size,a.size*.6),e.pop()}e.pop()}}isActive(){return this.active||this.particles.length>0}}class le{constructor(e){h(this,"state");this.state={currentLevelIndex:0,levels:e,completedLevels:new Set}}getCurrentLevel(){return this.state.levels[this.state.currentLevelIndex]}getCurrentLevelIndex(){return this.state.currentLevelIndex}getTotalLevels(){return this.state.levels.length}isLevelCompleted(e){return this.state.completedLevels.has(e)}isCurrentLevelCompleted(){return this.isLevelCompleted(this.state.currentLevelIndex)}isGameCompleted(){return this.state.completedLevels.size===this.state.levels.length}completeCurrentLevel(){this.state.completedLevels.add(this.state.currentLevelIndex)}advanceToNextLevel(){return this.state.currentLevelIndex<this.state.levels.length-1?(this.state.currentLevelIndex++,!0):!1}goToLevel(e){return e>=0&&e<this.state.levels.length?(this.state.currentLevelIndex=e,!0):!1}canGoToPreviousLevel(){return this.state.currentLevelIndex>0}canGoToNextLevel(){return this.state.currentLevelIndex<this.state.levels.length-1}goToPreviousLevel(){return this.canGoToPreviousLevel()?(this.state.currentLevelIndex--,!0):!1}goToNextLevel(){return this.canGoToNextLevel()?(this.state.currentLevelIndex++,!0):!1}checkWinCondition(e){const a=this.getCurrentLevel();return e===a.target}handleWin(e){return this.checkWinCondition(e)?(this.completeCurrentLevel(),this.advanceToNextLevel()):!1}}const se=[{id:1,target:2,description:"A 5-hopper and a 7-hopper had a baby. Can you get the baby to the fly on lilypad 2?",hopDistances:[5,7]},{id:2,target:3,description:"Get the (5, 7)-multihopper to the fly on lilypad 3!",hopDistances:[5,7]},{id:3,target:1,description:"Get the (5, 7)-multihopper to the fly on lilypad 1!",hopDistances:[5,7]}];function de(){return new le(se)}function fe(r){var M;r.innerHTML="",Z(r);const e=de(),a=ee(e.getCurrentLevel().description);r.appendChild(a);const o=document.createElement("div");o.className="celebration-modal",o.style.display="none",o.innerHTML=`
    <div class="modal-content">
      <div id="modalMessage"></div>
      <button id="modalBtn">Next Problem</button>
    </div>
  `,r.appendChild(o);const i=document.createElement("style");i.textContent=`
    .celebration-modal {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .celebration-modal[style*='none'] { display: none !important; }
    .modal-content {
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.12);
      padding: 32px 24px 24px 24px;
      text-align: center;
      min-width: 260px;
      max-width: 90vw;
    }
    #modalMessage {
      font-size: 1.3rem;
      margin-bottom: 24px;
    }
    #modalBtn {
      font-size: 1.1rem;
      padding: 10px 28px;
      border-radius: 8px;
      border: none;
      background: #8f8;
      color: #222;
      font-weight: bold;
      cursor: pointer;
      transition: background 0.2s;
    }
    #modalBtn:hover {
      background: #7ddc7d;
    }
  `,document.head.appendChild(i);const l=document.createElement("div");l.innerHTML=`
    <div id="toolbar">
      <div class="level-indicator">
        <span id="levelInfo">Problem ${e.getCurrentLevelIndex()+1} of ${e.getTotalLevels()}</span>
      </div>
      <div class="hop-buttons">
        <button id="left5">← 5</button>
        <button id="left7">← 7</button>
        <button id="right5">5 →</button>
        <button id="right7">7 →</button>
      </div>
    </div>
    <div id="pond"></div>
    <div id="belowSketch">
      ${j("showToggleLabelsButton")?'<button id="toggleDebugBtn">Toggle Labels</button>':""}
      <button id="resetFrogBtn">Reset Frog</button>
    </div>
  `,l.appendChild(document.createElement("style")).textContent=`
    #toolbar {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      padding: 0 10px;
      margin-bottom: 8px;
      gap: 8px;
    }
    .level-indicator {
      font-size: 16px;
      font-weight: bold;
      color: #333;
    }
    .hop-buttons {
      display: flex;
      gap: 8px;
      justify-content: center;
      max-width: 320px;
    }
    #toolbar button {
      padding: 6px 12px;
      font-size: 14px;
      min-width: 60px;
      white-space: nowrap;
    }
    #belowSketch {
      display: flex;
      gap: 8px;
      margin-top: 16px;
      flex-wrap: wrap;
      justify-content: center;
      width: 100%;
      padding: 0 10px;
    }
    #belowSketch button {
      padding: 8px 16px;
      font-size: 16px;
      flex: 1;
      max-width: 160px;
    }
    canvas { 
      display: block; 
      margin: 16px auto 0 auto;
      max-width: 100%;
    }
  `,r.appendChild(te(l));const P=l.querySelector("#pond"),z=l.querySelector("#levelInfo"),A=o.querySelector("#modalMessage"),C=o.querySelector("#modalBtn");let m=!1,p=!1,u=!1;const y=new re,g=ae(),n=_();function D(){const t=e.getCurrentLevel();z.textContent=`Problem ${e.getCurrentLevelIndex()+1} of ${e.getTotalLevels()}`,a.textContent=t.description}function S(){n.setFrogIdx(0),n.setFromIdx(0),n.setToIdx(0),n.setAnimating(!1),m=!1,p=!1,D()}function F(t,f,s){A.textContent=t,C.textContent=f,o.style.display="flex",C.onclick=()=>{o.style.display="none",s()}}const d=document.createElement("div");d.className="final-screen-overlay",d.style.display="none",d.innerHTML=`
    <div class="final-content">
      <div class="final-title">You finished all the problems! 🎉</div>
      <div class="final-subtitle">Problems completed: 3/3</div>
      <div class="final-buttons">
        <button id="playAgainBtn">Play Again</button>
        <button id="backToMenuBtn">Back to Menu</button>
      </div>
    </div>
  `,r.appendChild(d);const T=document.createElement("style");T.textContent=`
    .final-screen-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
    }
    .final-screen-overlay[style*='none'] { display: none !important; }
    .final-content {
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.12);
      padding: 40px 32px 32px 32px;
      text-align: center;
      min-width: 280px;
      max-width: 90vw;
    }
    .final-title {
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: 18px;
    }
    .final-subtitle {
      font-size: 1.2rem;
      margin-bottom: 32px;
    }
    .final-buttons {
      display: flex;
      gap: 16px;
      justify-content: center;
    }
    #playAgainBtn, #backToMenuBtn {
      font-size: 1.1rem;
      padding: 10px 28px;
      border-radius: 8px;
      border: none;
      background: #8f8;
      color: #222;
      font-weight: bold;
      cursor: pointer;
      transition: background 0.2s;
    }
    #playAgainBtn:hover, #backToMenuBtn:hover {
      background: #7ddc7d;
    }
  `,document.head.appendChild(T);const q=d.querySelector("#playAgainBtn"),R=d.querySelector("#backToMenuBtn");q.onclick=()=>{e.goToLevel(0),e.state.completedLevels.clear(),S(),d.style.display="none"},R.onclick=()=>{d.style.display="none",window.location.href="/frog-math/"};const L=new W(t=>{let f=null;t.setup=async()=>{try{f=await $(t)}catch{console.warn("Failed to load frog image, using emoji fallback"),f=null}const s=t.createCanvas(c.w,c.h,t.P2D);t.textSize(24),ne(s.canvas,g,{getCurrentCamX:()=>N(g,n.animating,n.fromIdx,n.toIdx,n.hopStart,n.hopDur,B,c.w,()=>t.millis())}),u=!0,X(n,0,0,()=>L.millis())},t.draw=()=>{t.push(),y.update(),Y({p:t,state:{frogIdx:n.frogIdx,fromIdx:n.fromIdx,toIdx:n.toIdx,hopStart:n.hopStart,hopDur:n.hopDur,animating:n.animating,setAnimating:n.setAnimating},isReachable:()=>!1,customCamX:oe(g,N(g,n.animating,n.fromIdx,n.toIdx,n.hopStart,n.hopDur,B,c.w,()=>t.millis())),showTarget:(s,w)=>{const v=e.getCurrentLevel();s===v.target&&(t.textAlign(t.CENTER,t.CENTER),t.textSize(24),t.text("🪰",w,c.h/2))},showBadge:(s,w,v)=>{const b=w-40,k=22,I=s-v-k/2,E=s-v+k/2;t.fill(255),t.stroke(0),t.strokeWeight(1),t.circle(I,b,20),t.fill(0),t.noStroke(),t.textAlign(t.CENTER,t.CENTER),t.textSize(14),t.text("5",I,b),t.fill(255),t.stroke(0),t.strokeWeight(1),t.circle(E,b,20),t.fill(0),t.noStroke(),t.textAlign(t.CENTER,t.CENTER),t.textSize(14),t.text("7",E,b)},debugMode:V,frogImage:f,onWin:()=>{const s=e.getCurrentLevel();n.frogIdx===s.target&&!n.animating&&!p?m||(O(),y.start(),m=!0,p=!0,e.canGoToNextLevel()?F("Nice job! You got the fly!","Next Problem",()=>{e.advanceToNextLevel(),S()}):d.style.display="flex"):m=!1}}),t.pop(),y.draw(t)}},P);function x(t){n.animating||p||(n.setFromIdx(n.frogIdx),n.setToIdx(n.frogIdx+t),n.setHopDur(K*Math.abs(t)),n.setHopStart(L.millis()),n.setAnimating(!0),ie(g),Q(n.hopDur))}l.querySelector("#left5").addEventListener("click",()=>{u&&x(-5)}),l.querySelector("#left7").addEventListener("click",()=>{u&&x(-7)}),l.querySelector("#right5").addEventListener("click",()=>{u&&x(5)}),l.querySelector("#right7").addEventListener("click",()=>{u&&x(7)}),(M=l.querySelector("#toggleDebugBtn"))==null||M.addEventListener("click",()=>{u&&U()}),l.querySelector("#resetFrogBtn").addEventListener("click",()=>{u&&(n.animating||p||J(n,()=>L.millis()))})}export{fe as mountMulti};
