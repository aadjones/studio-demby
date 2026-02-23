import{p as U,l as _,c as d,g as F,a as J,t as K,r as Q,b as V,d as Z,n as C,h as P,e as X,f as h,i as ee}from"./animation-KXmD0FeQ.js";import{a as te,c as ae,w as re}from"./uiHelpers-DXpBluTm.js";import{s as se,r as O,g as R,c as ne,a as ie}from"./sharedStyle-D6osx98Y.js";import"./index-DD6DSve3.js";const ce=[0,1,2,3,4,5,6,7,8,9,10];let m=3,b=!1;function de(i,e,v){i.innerHTML="",e||te(i),(e==null?void 0:e.fixedHopSize)!==void 0&&(m=e.fixedHopSize);const N=(e==null?void 0:e.allowedHopSizes)||ce,H=(e==null?void 0:e.hideHopSelector)||!1,w=ne(),t=J();let g=!1,x=0,I=0,E=0,T=0,S="";new U(r=>{let f=null,q=null,L=!1,y=!0,D=!1;function B(){const a=document.querySelector(".trail-node-game-area");a&&a.classList.remove("trail-node-game-area--hidden")}function A(){if(D||!(e!=null&&e.requireExplicitAnswer)||document.getElementById("answerButtons"))return;D=!0;const a=document.createElement("div");if(a.id="answerButtons",a.style.cssText=`
        display: flex;
        gap: 12px;
        justify-content: center;
        margin-top: 20px;
      `,e.answerType==="yes-no"){const s=document.createElement("button");s.textContent="Yes",s.style.cssText=`
          padding: 10px 20px;
          font-size: 16px;
          font-weight: bold;
          background: #2ca750;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          min-width: 90px;
        `,s.onclick=()=>{a.remove(),B()};const l=document.createElement("button");l.textContent="No",l.style.cssText=`
          padding: 10px 20px;
          font-size: 16px;
          font-weight: bold;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          min-width: 90px;
        `,l.onclick=()=>{a.remove(),B()};const o=document.createElement("button");o.textContent="Not sure",o.style.cssText=`
          padding: 10px 20px;
          font-size: 16px;
          font-weight: bold;
          background: #6c757d;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          min-width: 90px;
        `,o.onclick=()=>{a.remove(),B()},a.appendChild(s),a.appendChild(l),a.appendChild(o)}else{const s=document.createElement("button");s.textContent=e.answerType==="continue"?"Continue":"I see the pattern!",s.style.cssText=`
          padding: 10px 24px;
          font-size: 16px;
          font-weight: bold;
          background: #2ca750;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        `,s.onclick=()=>{a.remove(),v&&v()},a.appendChild(s)}const n=document.getElementById("trail-answer-container");if(n)n.appendChild(a);else{const s=i.querySelector("canvas");s&&s.nextSibling?s.parentElement.insertBefore(a,s.nextSibling):i.appendChild(a)}}function j(){if(!(e!=null&&e.cameraSequence)||e.cameraSequence.length===0){y=!0;return}g=!0,x=0,I=r.millis(),y=!1,T=t.frogIdx*h-d.w/2;const a=e.cameraSequence[0];E=a.targetPad*h-d.w/2,S=a.message||"",S&&z(S);const n=i.closest(".trail-node-game-area");n&&n.classList.add("camera-sequence-active")}function z(a){let n=i.querySelector("#cameraMessageOverlay");n||(n=document.createElement("div"),n.id="cameraMessageOverlay",n.style.cssText=`
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.85);
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          font-size: 16px;
          max-width: 90%;
          text-align: center;
          z-index: 50;
          pointer-events: none;
        `,i.appendChild(n)),n.textContent=a,n.style.display=a?"block":"none"}function G(){const a=i.querySelector("#cameraMessageOverlay");a&&a.remove()}function $(){if(!g||!(e!=null&&e.cameraSequence))return;const a=e.cameraSequence[x],n=r.millis()-I,s=Math.min(1,n/a.durationMs),l=s<.5?2*s*s:1-Math.pow(-2*s+2,2)/2,o=x===0?t.frogIdx*h-d.w/2:e.cameraSequence[x-1].targetPad*h-d.w/2;if(T=o+(E-o)*l,a.hopTo!==void 0&&!t.animating&&n>500){const p=a.hopTo;if(t.frogIdx!==p){t.setFromIdx(t.frogIdx),t.setToIdx(p),t.setAnimating(!0),t.setHopStart(r.millis());const c=Math.abs(p-t.frogIdx),u=P(c);t.setHopDur(u),X(u)}}if(s>=1)if(x++,x>=e.cameraSequence.length)W();else{I=r.millis();const p=e.cameraSequence[x];E=p.targetPad*h-d.w/2,S=p.message||"",z(S)}}function W(){g=!1,y=!0,S="";const a=i.querySelector("#skipIntroBtn");a&&a.remove(),G();const n=i.closest(".trail-node-game-area");n&&n.classList.remove("camera-sequence-active"),e!=null&&e.requireExplicitAnswer&&!e.autoContinueAfterMs&&A()}function Y(){e!=null&&e.successCondition&&!L&&e.successCondition(t)&&(L=!0,setTimeout(()=>{v&&v()},500))}function k(a){if(!y||t.animating)return;const n=m===0?t.frogIdx:C(t.frogIdx,m,a),s=Math.abs(n-t.frogIdx),l=P(s);t.setFromIdx(t.frogIdx),t.setToIdx(n),t.setFrogIdx(n),t.setHopStart(r.millis()),t.setHopDur(l),t.setAnimating(!0),O(w),X(l),setTimeout(()=>{Y()},l+100)}r.setup=async()=>{try{q=await _(r)}catch{console.warn("Failed to load frog image, using emoji fallback"),q=null}const a=document.createElement("div");a.id="ui",a.innerHTML=`
        <div class="hop-controls">
          ${H?"":'<select id="hopSelect"></select>'}
          <div class="hop-buttons">
            <button id="leftBtn">← Hop Left</button>
            <button id="rightBtn">Hop Right →</button>
          </div>
        </div>
      `;const n=document.createElement("style");n.textContent=`
        #ui { 
          display: flex; 
          margin: 0 auto 8px auto;
          width: 100%;
          padding: 0 10px;
        }
        .hop-controls {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
          align-items: center;
        }
        .hop-buttons {
          display: flex;
          gap: 12px;
          justify-content: center;
          width: 100%;
        }
        #ui button { 
          padding: 8px 16px; 
          font-size: 16px; 
          min-width: 120px;
          max-width: 160px;
        }
        #hopSelect { 
          width: 100%;
          max-width: 200px;
          padding: 8px;
          font-size: 16px;
          border-radius: 4px;
          border: 1px solid #ccc;
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
      `;const s=r.createCanvas(d.w,d.h).elt;r.textSize(24),se(s,w,{getCurrentCamX:()=>R(w,t.animating,t.fromIdx,t.toIdx,t.hopStart,t.hopDur,h,d.w,()=>r.millis())}),b=!0;const l=document.createElement("div");l.id="belowSketch",l.innerHTML=`
        ${F("showToggleLabelsButton")?'<button id="toggleDebugBtn">Toggle Labels</button>':""}
        <button id="resetFrogBtn">Reset Frog</button>
      `;const o=document.createElement("div");if(o.appendChild(a),o.appendChild(n),o.appendChild(s),o.appendChild(l),e||i.appendChild(ae("Meet the hoppers!")),i.appendChild(re(o)),i.querySelector("#leftBtn").addEventListener("click",()=>{b&&r.millis()-t.hopStart>=t.hopDur&&k(-1)}),i.querySelector("#rightBtn").addEventListener("click",()=>{b&&r.millis()-t.hopStart>=t.hopDur&&k(1)}),F("showToggleLabelsButton")&&i.querySelector("#toggleDebugBtn").addEventListener("click",K),i.querySelector("#resetFrogBtn").addEventListener("click",()=>{b&&(t.animating||(O(w),Q(t,()=>r.millis())))}),!H){const c=i.querySelector("#hopSelect");c.addEventListener("keydown",u=>{u.key.startsWith("Arrow")&&u.preventDefault()}),N.forEach(u=>{const M=document.createElement("option");M.value=u.toString(),M.textContent=`${u}-hopper`,c.appendChild(M)}),c.value=m.toString(),c.addEventListener("change",u=>{m=+u.target.value})}f=c=>{b&&(r.millis()-t.hopStart<t.hopDur||((c.key==="ArrowRight"||c.key==="d")&&(c.preventDefault(),c.stopPropagation(),k(1)),(c.key==="ArrowLeft"||c.key==="a")&&(c.preventDefault(),c.stopPropagation(),k(-1)),(c.key==="ArrowUp"||c.key==="ArrowDown")&&(c.preventDefault(),c.stopPropagation())))},window.addEventListener("keydown",f,!0),V(t,0,0,()=>r.millis()),e!=null&&e.cameraSequence?setTimeout(()=>j(),500):e!=null&&e.autoContinueAfterMs?setTimeout(()=>{A()},e.autoContinueAfterMs):e!=null&&e.requireExplicitAnswer&&A();const p=new MutationObserver(()=>{i.contains(a)||(f&&window.removeEventListener("keydown",f),p.disconnect())});p.observe(i,{childList:!0})},r.draw=()=>{g&&$(),r.push();const a=R(w,t.animating,t.fromIdx,t.toIdx,t.hopStart,t.hopDur,h,d.w,()=>r.millis()),n=g?T:ie(w,a);Z({p:r,state:{frogIdx:t.frogIdx,fromIdx:t.fromIdx,toIdx:t.toIdx,hopStart:t.hopStart,hopDur:t.hopDur,animating:t.animating,setAnimating:t.setAnimating},isReachable:s=>s===t.frogIdx||((s-t.frogIdx)%m+m)%m===0,customCamX:n,showBadge:(s,l,o)=>{const p=s-o,u=l-40;r.fill(255),r.stroke(0),r.strokeWeight(1),r.circle(p,u,20),r.fill(0),r.noStroke(),r.textAlign(r.CENTER,r.CENTER),r.textSize(14),r.text(m.toString(),p,u)},debugMode:ee,frogImage:q,highlightPads:e==null?void 0:e.highlightPads,targetPad:e==null?void 0:e.targetPad}),r.pop()}},i)}export{de as mountSingle};
