import settings from './card-depth-settings.js';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const states=new Map();
let frame=0,last=0;
const clamp=value=>Math.max(-1,Math.min(1,value));
function reset(state) {
  state.x=state.y=state.tx=state.ty=0;
  state.stage.style.transform='';
  for(const image of state.layers)image.style.transform='';
  state.face.classList.remove('depth-active');
  states.delete(state.face);
}
function animate(now) {
  frame=0;
  const dt=Math.min(.05,last?(now-last)/1000:1/60);last=now;
  for(const state of states.values()) {
    if(reduced.matches||document.hidden||!state.face.isConnected||state.face.closest('[hidden]')) {reset(state);continue;}
    const blend=1-Math.exp(-settings.response*dt);
    state.x+=(state.tx-state.x)*blend;state.y+=(state.ty-state.y)*blend;
    if(!state.hover&&Math.hypot(state.x,state.y)<.001) {reset(state);continue;}
    const width=state.face.clientWidth;
    state.stage.style.transform=`perspective(${width*settings.perspectiveDistance}px) rotateX(${-state.y*settings.maximumTiltDegrees}deg) rotateY(${state.x*settings.maximumTiltDegrees}deg)`;
    for(const image of state.layers) {
      const background=image.classList.contains('game-background');
      const overscan=background?settings.backgroundOverscan:settings.foregroundOverscan;
      const shift=background?settings.backgroundParallax:Number(image.dataset.parallax);
      const w=image.clientWidth,h=image.clientHeight;
      const fit=Math.max(w/(image.naturalWidth||w),h/(image.naturalHeight||h));
      const dx=-state.x*shift*settings.artworkMotionScale*(image.naturalWidth||w)*fit*overscan;
      const dy=-state.y*shift*settings.artworkMotionScale*(image.naturalHeight||h)*fit*overscan;
      image.style.transform=`translate3d(${dx}px,${dy}px,0) scale(${overscan})`;
    }
    if(!state.hover&&Math.hypot(state.x-state.tx,state.y-state.ty)<.001)reset(state);
  }
  // No ambient animation loop: work only while a card moves or settles.
  if([...states.values()].some(s=>Math.hypot(s.x-s.tx,s.y-s.ty)>.001||!s.hover))frame=requestAnimationFrame(animate);
  else last=0;
}
function schedule(){if(!frame)frame=requestAnimationFrame(animate);}
for(const face of document.querySelectorAll('.game-card-face')) {
  const state={face,stage:face.querySelector('.game-card-stage'),layers:[...face.querySelectorAll('[data-parallax]')],x:0,y:0,tx:0,ty:0,hover:false};
  face.addEventListener('pointermove',event=>{
    if(reduced.matches||event.pointerType==='touch')return;
    const rect=face.getBoundingClientRect();
    state.tx=clamp((event.clientX-rect.left)/rect.width*2-1);
    state.ty=clamp((event.clientY-rect.top)/rect.height*2-1);
    const magnitude=Math.hypot(state.tx,state.ty);if(magnitude>1){state.tx/=magnitude;state.ty/=magnitude;}
    state.hover=true;states.set(face,state);face.classList.add('depth-active');schedule();
  },{passive:true});
  const leave=()=>{state.hover=false;state.tx=state.ty=0;if(states.has(face))schedule();};
  face.addEventListener('pointerleave',leave);face.addEventListener('pointercancel',leave);
}
function resetAll(){for(const state of states.values())reset(state);if(frame)cancelAnimationFrame(frame);frame=last=0;}
reduced.addEventListener('change',resetAll);
window.addEventListener('blur',resetAll);
document.addEventListener('visibilitychange',()=>{if(document.hidden)resetAll();});
