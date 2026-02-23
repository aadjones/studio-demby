import{p as O,q as U,k as j,s as X,e as Y,o as z,h as _}from"./animation-KXmD0FeQ.js";import{a as K,c as W,w as G}from"./uiHelpers-DXpBluTm.js";import{s as J}from"./keyboardControls-TneRnsrb.js";import"./index-DD6DSve3.js";function tt(r){r.innerHTML="",K(r),r.appendChild(W("Ever-increasing hops! 🚀"));const n=document.createElement("div");n.innerHTML=`
    <div class="hop-controls" style="display:flex;flex-direction:column;align-items:center;">
   
      <div class="hop-buttons">
        <button id="rightBtn">Hop Right →</button>
      </div>
    </div>
    <div id="pondCanvas"></div>
    <div class="belowSketch" style="display:flex;justify-content:center;margin-top:18px;">
      <button id="resetFrogBtn">Reset Frog</button>
    </div>
  `,r.appendChild(G(n));const l=13;let c=0,f=0,b=0,g=0,e=0,d=-Math.PI/2,m=-Math.PI/2,y=!1,p=!1;const v=n.querySelector("#pondCanvas");v.style.marginTop="32px";const T=new O(t=>{let h=null;t.setup=async()=>{try{h=await U(t)}catch{console.warn("Failed to load uberhopper image, using emoji fallback"),h=null}t.createCanvas(400,400),p=!0},t.draw=()=>{t.background(255),t.translate(t.width/2,t.height/2);const o=120;for(let a=0;a<l;a++){const i=a/l*t.TWO_PI-t.HALF_PI,R=o*Math.cos(i),A=o*Math.sin(i),x=i+Math.PI;j(t,R,A,32,"#8f8",{notchAngle:x,notchSize:1.8,squish:!1});const E=20,D=R+E*Math.cos(x),N=A+E*Math.sin(x);t.fill(0),t.textAlign(t.CENTER,t.CENTER),t.textSize(14),t.text(a.toString(),D,N)}let s,u;const C=16,I=7;if(e===0)s=d,u=o+C+I;else{const a=d,i=t.constrain((t.millis()-g)/e,0,1);s=t.lerp(a,m,i),i===1&&(d=m,y=!1,e=0),u=o+C+I}const q=u*Math.cos(s),B=u*Math.sin(s),w=80;X(t,q,B,h,w);const F=w*.5,k=u+F,H=k*Math.cos(s),P=k*Math.sin(s);t.textSize(18),t.fill(255),t.circle(H,P,24),t.fill(0);const L=2*c+1;t.text(L.toString(),H,P)}},v);function S(){const t=2*c+1,h=z(f,t,l,1),o=n.querySelector("#nextHopDisplay");o&&(o.textContent=h.toString())}function M(){if(y)return;const t=2*c+1;b=z(f,t,l,1),f=b,e=_(t),m=d+t/l*(Math.PI*2),g=T.millis(),y=!0,Y(e),c++,S()}n.querySelector("#rightBtn").addEventListener("click",()=>{p&&M()}),n.querySelector("#resetFrogBtn").addEventListener("click",()=>{p&&(f=0,b=0,g=0,e=0,c=0,d=-Math.PI/2,S())}),J(r,n,{onRightHop:()=>M()},{readyCheck:()=>p,animationCheck:()=>e!==0&&performance.now()-g<e})}export{tt as mountUberhopper};
