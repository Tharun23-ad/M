(function(){
  var wrap   = document.getElementById('artistWrap');
  if(!wrap) return;
  var pupilL = document.getElementById('pupilL');
  var pupilR = document.getElementById('pupilR');
  var irisL  = document.getElementById('irisL');
  var irisR  = document.getElementById('irisR');
  var shineL = document.getElementById('shineL');
  var shineR = document.getElementById('shineR');
  var eyeL   = { cx:109, cy:172 };
  var eyeR   = { cx:171, cy:172 };
  var maxMove = 4;
  var mouseX = window.innerWidth/2, mouseY = window.innerHeight/2;
  var lastScrollY = window.scrollY;
  var tiltX = 0, tiltY = 0, targetTiltX = 0, targetTiltY = 0;
  var eyeDX = 0, eyeDY = 0, targetEyeDX = 0, targetEyeDY = 0;

  document.addEventListener('mousemove', function(e){
    mouseX = e.clientX; mouseY = e.clientY;
    var rect = wrap.getBoundingClientRect();
    var cx = rect.left + rect.width * 0.5;
    var cy = rect.top  + rect.height * 0.44;
    var dx = (mouseX - cx) / (window.innerWidth/2);
    var dy = (mouseY - cy) / (window.innerHeight/2);
    targetTiltX = -dy * 12;
    targetTiltY =  dx * 12;
    var ex = mouseX - cx, ey = mouseY - cy;
    var len = Math.sqrt(ex*ex + ey*ey) || 1;
    targetEyeDX = (ex/len) * maxMove;
    targetEyeDY = (ey/len) * maxMove;
  });

  window.addEventListener('scroll', function(){
    var delta = window.scrollY - lastScrollY;
    targetTiltX += delta * 0.2;
    targetTiltX  = Math.max(-18, Math.min(18, targetTiltX));
    targetEyeDY += delta * 0.04;
    targetEyeDY  = Math.max(-maxMove, Math.min(maxMove, targetEyeDY));
    lastScrollY  = window.scrollY;
  });

  function setEye(pupil, iris, shine, base, dx, dy){
    if(pupil){ pupil.setAttribute('cx', base.cx+dx);       pupil.setAttribute('cy', base.cy+dy); }
    if(iris) { iris.setAttribute('cx',  base.cx+dx*0.7);   iris.setAttribute('cy',  base.cy+dy*0.7); }
    if(shine){ shine.setAttribute('cx', base.cx+dx+2);     shine.setAttribute('cy', base.cy+dy-2); }
  }

  function animate(){
    tiltX  += (targetTiltX  - tiltX)  * 0.08; targetTiltX  *= 0.97;
    tiltY  += (targetTiltY  - tiltY)  * 0.08; targetTiltY  *= 0.97;
    eyeDX  += (targetEyeDX  - eyeDX)  * 0.10; targetEyeDX  *= 0.98;
    eyeDY  += (targetEyeDY  - eyeDY)  * 0.10; targetEyeDY  *= 0.98;
    wrap.style.transform = 'perspective(800px) rotateX('+tiltX.toFixed(2)+'deg) rotateY('+tiltY.toFixed(2)+'deg)';
    setEye(pupilL, irisL, shineL, eyeL, eyeDX, eyeDY);
    setEye(pupilR, irisR, shineR, eyeR, eyeDX, eyeDY);
    requestAnimationFrame(animate);
  }
  animate();
})();



function handleSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('submit-btn');
  const success = document.getElementById('form-success');
  btn.textContent = 'Sending...';
  btn.style.opacity = '0.7';
  setTimeout(() => {
    btn.style.display = 'none';
    success.style.display = 'block';
  }, 1200);
}

// Fade-in on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.project-card, .gallery-item, .skills-category').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});



(function(){
  var wrap = document.getElementById('heroReveal');
  var toon = wrap && wrap.querySelector('.reveal-toon');
  if(!wrap||!toon) return;
  var R=0, TR=0, MAX=130;
  var cx=50, cy=50, tx=50, ty=50;
  var raf=null;
  function lerp(a,b,t){return a+(b-a)*t;}
  function applyMask(){
    if(R < 0.5){
      // Fully cover: no mask = cartoon shows entirely
      toon.style.webkitMaskImage = 'none';
      toon.style.maskImage = 'none';
      return;
    }
    var soft=(R*0.28).toFixed(1);
    var edge=(R+parseFloat(soft)).toFixed(1);
    // Transparent hole at cursor = photo shows; black outside = cartoon shows
    var m='radial-gradient(circle '+R.toFixed(1)+'px at '+cx.toFixed(1)+'% '+cy.toFixed(1)+'%, transparent 0%, transparent '+R.toFixed(1)+'px, black '+edge+'px)';
    toon.style.webkitMaskImage=m;
    toon.style.maskImage=m;
  }
  function tick(){
    var d=false;
    var nc=lerp(cx,tx,0.10), ny=lerp(cy,ty,0.10);
    if(Math.abs(nc-cx)>0.04||Math.abs(ny-cy)>0.04){cx=nc;cy=ny;d=true;}else{cx=tx;cy=ty;}
    var nr=lerp(R,TR,0.07);
    if(Math.abs(nr-R)>0.08){R=nr;d=true;}else{R=TR;}
    applyMask();
    raf=(d||R>0.3)?requestAnimationFrame(tick):null;
  }
  function getPos(e){
    var r=wrap.getBoundingClientRect();
    tx=((e.clientX-r.left)/r.width*100);
    ty=((e.clientY-r.top)/r.height*100);
  }
  wrap.addEventListener('mouseenter',function(e){
    wrap.classList.add('is-hovered');
    getPos(e); cx=tx; cy=ty; TR=MAX;
    if(!raf) raf=requestAnimationFrame(tick);
  });
  wrap.addEventListener('mousemove',function(e){
    getPos(e);
    if(!raf) raf=requestAnimationFrame(tick);
  });
  wrap.addEventListener('mouseleave',function(){
    wrap.classList.remove('is-hovered');
    TR=0;
    if(!raf) raf=requestAnimationFrame(tick);
  });
  // Touch
  wrap.addEventListener('touchstart',function(e){
    wrap.classList.add('is-hovered');
    var t=e.touches[0]; getPos(t); cx=tx; cy=ty; TR=MAX;
    if(!raf) raf=requestAnimationFrame(tick);
  },{passive:true});
  wrap.addEventListener('touchmove',function(e){
    e.preventDefault(); getPos(e.touches[0]);
    if(!raf) raf=requestAnimationFrame(tick);
  },{passive:false});
  wrap.addEventListener('touchend',function(){
    wrap.classList.remove('is-hovered');
    TR=0;
    if(!raf) raf=requestAnimationFrame(tick);
  });
  applyMask();
})();