import{p as D,l as W,k as j,m as $,e as F,M as _,o as N,h as X}from"./animation-KXmD0FeQ.js";import{a as Y,c as K,w as G}from"./uiHelpers-DXpBluTm.js";import{s as J}from"./keyboardControls-TneRnsrb.js";import"./index-DD6DSve3.js";function ee(f){f.innerHTML="",Y(f),f.appendChild(K("Explore the pond!"));const l=document.createElement("div");l.innerHTML=`
    <div class="hop-controls" style="display:flex;flex-direction:column;align-items:center;">
      <div class="pond-selects" style="margin-bottom:18px;">
        <label>pads
          <select id="padSelect">
            ${[7,8,9,10,11,12,13].map(e=>`<option>${e}</option>`).join("")}
          </select>
        </label>
        <label>hopper
          <select id="hopSelect"></select>
        </label>
      </div>
      <div class="hop-buttons">
        <button id="leftBtn">← Hop Left</button>
        <button id="rightBtn">Hop Right →</button>
      </div>
    </div>
    <div id="pondCanvas"></div>
    <div class="belowSketch" style="display:flex;justify-content:center;margin-top:18px;">
      <button id="resetFrogBtn">Reset Frog</button>
    </div>
  `,f.appendChild(G(l));const y=l.querySelector("#padSelect");let n=+y.value,s=3,o=0,h=0,u=0,a=0,t=0,p=1,r=!1,g=!1;const C=l.querySelector("#pondCanvas");C.style.marginTop="32px";const P=new D(e=>{let c=null;e.setup=async()=>{try{c=await W(e)}catch{console.warn("Failed to load frog image, using emoji fallback"),c=null}e.createCanvas(400,400),g=!0},e.draw=()=>{e.background(255),e.translate(e.width/2,e.height/2);const x=120;let d;if(r&&t>0)d=o/n*e.TWO_PI-e.HALF_PI,e.constrain((e.millis()-a)/t,0,1)===1&&(r=!1);else if(t===0)d=o/n*e.TWO_PI-e.HALF_PI;else{const i=h/n*e.TWO_PI-e.HALF_PI,b=i+p*(s/n)*e.TWO_PI,S=e.constrain((e.millis()-a)/t,0,1);d=e.lerp(i,b,S)}for(let i=0;i<n;i++){const b=i/n*e.TWO_PI-Math.PI/2,S=x*Math.cos(b),E=x*Math.sin(b),M=b+Math.PI;j(e,S,E,32,"#8f8",{notchAngle:M,notchSize:1.8,squish:!1});const A=20,O=S+A*Math.cos(M),z=E+A*.8*Math.sin(M);e.fill(0),e.textAlign(e.CENTER,e.CENTER),e.textSize(14),e.text(i.toString(),O,z)}const I=x+32/2+8,R=I*Math.cos(d),B=I*Math.sin(d),k=48;$(e,R,B,c,k,!0);const q=.75*k,L=I+q,T=L*Math.cos(d),w=L*Math.sin(d);e.textSize(18),e.fill(255),e.circle(T,w,18),e.fill(0),e.text(s.toString(),T,w)}},C),m=l.querySelector("#hopSelect"),H=()=>{m.innerHTML="";for(let e=0;e<n;e++){const c=document.createElement("option");c.value=e.toString(),c.textContent=`${e}-hopper`,m.appendChild(c)}m.value=s.toString()};H(),y.onchange=()=>{n=+y.value,s>=n&&(s=1),H(),o=0,h=0,u=0,a=0,t=0,p=1,r=!1},m.onchange=()=>{s=+m.value,h=o,u=o,a=0,t=0,r=!1};function v(e){h=o,s===0?(u=o,t=_,a=P.millis(),r||F(_),r=!0):(u=N(o,s,n,e),o=u,t=X(s),a=P.millis(),F(t),p=e)}l.querySelector("#leftBtn").addEventListener("click",()=>{g&&v(-1)}),l.querySelector("#rightBtn").addEventListener("click",()=>{g&&v(1)}),l.querySelector("#resetFrogBtn").addEventListener("click",()=>{g&&(o=0,h=0,u=0,a=0,t=0,p=1,r=!1)}),J(f,l,{onLeftHop:()=>v(-1),onRightHop:()=>v(1)},{readyCheck:()=>g,animationCheck:()=>t!==0&&performance.now()-a<t})}export{ee as mountPond};
