"use strict";

/* ============================================================
   UI — panel slider/button wiring
   ============================================================ */
const UI = (function () {
  const { $ } = Dom;
  const { groups, funcs } = ModeBasis;
  const { nodalGroup, strikeMarker, renderer } = SceneRig;
  const explore = ExploreMode.state;
  const strike = StrikeEngine.state;
  const clock = PlaybackClock.state;

  function updateButtonStates(){
    $('resetMuteBtn').disabled = !groups.some(g=>g.muted);
    $('restrikeBtn').disabled = !strike.strikeActive;
  }

  function reportDamping(){
    if (strike.dampAmount === 0){
      $('info').innerHTML =
        `<b>Damping off</b>: the membrane rings forever visually. The sound still fades out ` +
        `after a few seconds to minimize annoyance. Turn damping up to make the whole ` +
        `thing die out like a real drum.`;
      return;
    }
    const g01 = groups.find(g=>g.m===0&&g.n===1);
    const g21 = groups.find(g=>g.m===2&&g.n===1);
    const g02 = groups.find(g=>g.m===0&&g.n===2);
    let s = `<b>How long each mode rings</b>: (0,1) fades out in ${g01.t60.toFixed(2)}s; ` +
            `the highest mode in ${groups[groups.length-1].t60.toFixed(2)}s. ` +
            `High modes die first.`;
    if (g21 && g02){
      s += `<br><b>Why some modes outlast others:</b> shape. (0,2) pushes air as a whole and radiates fast; ` +
           `(2,1)'s lobes cancel out, so it rings on.`;
    }
    $('info').innerHTML = s;
  }

  function initUI(){
    $('mS').addEventListener('input', e=>{ explore.exM=+e.target.value; $('mVal').textContent=explore.exM; ExploreMode.computeExplore(); });
    $('nS').addEventListener('input', e=>{ explore.exN=+e.target.value; $('nVal').textContent=explore.exN; ExploreMode.computeExplore(); });
    $('spS').addEventListener('input', e=>{
      const now = performance.now();
      // bank elapsed time at the OLD speed, then restart the clock, so
      // changing speed doesn't retroactively rescale the whole history
      clock.exPaused = PlaybackClock.exElapsed(now); clock.exStart = now;
      clock.elapsedAtPause = PlaybackClock.strikeElapsed(now); clock.runStart = now;
      clock.speed = +e.target.value; $('spVal').textContent = clock.speed.toFixed(1) + '×';
    });
    $('playBtn').addEventListener('click', ()=>{
      const now = performance.now();
      if (clock.exPlaying){ clock.exPaused = PlaybackClock.exElapsed(now); }
      else { clock.exStart = now; }
      clock.exPlaying = !clock.exPlaying;
      $('playBtn').textContent = clock.exPlaying ? 'Pause' : 'Play';
    });
    $('resetMuteBtn').addEventListener('click', ()=>{
      for (const g of groups){ g.muted = false; AudioEngine.setMuted(g, false); }
      SpectrumView.drawSpectrum();
    });
    $('restrikeBtn').addEventListener('click', ()=>{
      if (strike.strikeActive){
        AudioEngine.ensureContext();   // unlock while user activation is still active
        const r0 = strike.strikeR0, th0 = strike.strikeTh0;
        DrumstickView.strike(r0, th0, () => {
          StrikeEngine.doStrike(r0, th0);
          SpectrumView.drawSpectrum();
          AudioEngine.strike();
        });
      }
    });
    $('dampS').addEventListener('input', e=>{
      strike.dampAmount = (+e.target.value)/100;
      StrikeEngine.updateDamping();
      AudioEngine.updateDamping();
      $('dampVal').textContent = strike.dampAmount===0 ? 'off' : strike.dampAmount.toFixed(2);
      reportDamping();
      SpectrumView.drawSpectrum();
    });

    $('btnExplore').addEventListener('click', ()=>{
      clock.viewMode='explore';
      $('btnExplore').classList.add('active'); $('btnStrike').classList.remove('active');
      $('explorePanel').style.display=''; $('strikePanel').style.display='none';
      strikeMarker.visible=false;
      nodalGroup.visible = true;
      $('subtitle').innerHTML = 'u = J<sub>m</sub>(kr)&thinsp;cos(m&theta;)&thinsp;cos(&omega;t)';
      $('canvasHint').textContent = 'drag to rotate';
      renderer.domElement.style.cursor = 'grab';
      clock.exStart = performance.now(); clock.exPaused = 0;
      ExploreMode.computeExplore();
    });
    $('btnStrike').addEventListener('click', ()=>{
      clock.viewMode='strike';
      $('btnStrike').classList.add('active'); $('btnExplore').classList.remove('active');
      $('explorePanel').style.display='none'; $('strikePanel').style.display='';
      nodalGroup.visible=false;
      strikeMarker.visible=strike.strikeActive;
      $('subtitle').innerHTML =
        `superposition of ${funcs.length} modes, excited by strike position`;
      $('canvasHint').textContent = 'tap the drumhead to strike · drag to rotate';
      renderer.domElement.style.cursor = 'pointer';
      reportDamping();
      clock.runStart = performance.now(); clock.elapsedAtPause = 0;
      SpectrumView.drawSpectrum();
    });

    updateButtonStates();
  }

  return { initUI, reportDamping, updateButtonStates };
})();
