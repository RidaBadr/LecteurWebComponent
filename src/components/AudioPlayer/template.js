const template = document.createElement('template')
import css from './style.js'

template.innerHTML = `${css}
<div id="root">
<h2 id="title"></h2>
    <audio controls crossOrigin="anonymous" class="audio-element" src=""></audio><br>
    <div class="canvas-wrapper">
    <canvas id="wave-form"></canvas>
</div>
    <button id="play"><img src="https://img.icons8.com/android/24/000000/play.png" alt="Play"/></button>
    <button id="pause"><img src="https://img.icons8.com/android/24/000000/pause.png" alt="Pause"/></button>
    <button id="backward"><img src="https://img.icons8.com/fluent-systems-regular/24/000000/replay-10.png" alt="Backward"/></button>
    <button id="forward"><img src="https://img.icons8.com/fluent-systems-regular/24/000000/forward-10.png" alt="Forward"/></button>
    <button id="stop"><img src="https://img.icons8.com/android/24/000000/stop.png" alt="stop"/></button>
    <input id="loop" type="checkbox" style="display:none"><br>
    <webaudio-knob 
    id="gain" 
    src="./assets/imgs/LittlePhatty.png" 
    value="0"  max="3"  step="0.1" diameter="55">
    </webaudio-knob>
    <br>
    <webaudio-knob 
        id="panner" 
        src="./assets/imgs/knobs.png" 
        value="0" min="-1" max="1" step="0.1" diameter="60">
    </webaudio-knob>
   
  
    <div id="equalizer">
        <div id="equalizer-inputs">
                <webaudio-knob 
                id="eq-in-4" 
                src="./assets/imgs/Button3.png" 
                value="0" min="-20" max="20" step="0.1" diameter="60"  tooltip="Band 1000Hz">
                </webaudio-knob>
                <br>
            <webaudio-knob 
                id="eq-in-5" 
                src="./assets/imgs/Button3.png" 
                value="0" min="-20" max="20" step="0.1" diameter="60"  tooltip="Band 3500Hz">
                </webaudio-knob>
                <br>
            <webaudio-knob 
                id="eq-in-5" 
                src="./assets/imgs/Button3.png" 
                value="0" min="-20" max="20" step="0.1" diameter="60"  tooltip="Band 3500Hz">
                </webaudio-knob>
                <br>
        </div>
    </div>
     <label class="switch">
  <input type="checkbox">
  <span class="slider round"></span>
</label>

</div>
`

export default template
