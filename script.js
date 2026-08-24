/* ============================================================
   "a little something for you" — full interactive flow
   ============================================================ */

const scenes = [...document.querySelectorAll('.scene')];
const progressBar = document.getElementById('progressBar');
let currentIndex = 0;

function idx(id){ return scenes.findIndex(s=>s.id===id); }

function show(i){
  scenes.forEach((s,n)=>s.classList.toggle('active', n===i));
  currentIndex = i;
  progressBar.style.width = `${((i+1)/scenes.length)*100}%`;
}

function goTo(id, delay=0){
  setTimeout(()=>{
    show(idx(id));
    playScene(id);
  }, delay);
}

/* ---------- click heart burst (global fx) ---------- */
function heartsAt(x,y,count=8){
  const colors=['#f33f80','#ff2d55','#ffffff'];
  for(let i=0;i<count;i++){
    const h=document.createElement('span');
    h.className='click-heart';
    h.textContent = Math.random()>.35 ? '♥' : '♡';
    h.style.color = colors[Math.floor(Math.random()*colors.length)];
    h.style.left = `${x+(Math.random()*30-15)}px`;
    h.style.top = `${y+(Math.random()*20-10)}px`;
    h.style.fontSize = `${13+Math.random()*16}px`;
    h.style.setProperty('--dx', `${Math.random()*140-70}px`);
    h.style.animation = 'clickFly 1.1s ease-out forwards';
    document.body.appendChild(h);
    setTimeout(()=>h.remove(), 1200);
  }
}
document.querySelectorAll('.next-btn').forEach(btn=>{
  btn.addEventListener('click', e=>{
    heartsAt(e.clientX, e.clientY, 6);
    const target = btn.dataset.next;
    setTimeout(()=>{ show(idx(target)); playScene(target); }, 280);
  });
});

/* ---------- small toast note ---------- */
const toastEl = document.getElementById('toast');
let toastTimer = null;
function showToast(text, hold=2200){
  if(!toastEl) return;
  toastEl.textContent = text;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=> toastEl.classList.remove('show'), hold);
}

/* ---------- reusable floating hearts spawner ---------- */
function spawnFloaters(container, count, classes){
  container.innerHTML='';
  for(let i=0;i<count;i++){
    const i_ = document.createElement('i');
    i_.className = classes[Math.floor(Math.random()*classes.length)];
    i_.textContent = Math.random()>.4 ? '♥' : '♡';
    i_.style.left = `${Math.random()*100}%`;
    i_.style.fontSize = `${13+Math.random()*20}px`;
    i_.style.setProperty('--dx', `${Math.random()*60-30}px`);
    i_.style.animationDuration = `${7+Math.random()*7}s`;
    i_.style.animationDelay = `${Math.random()*8}s`;
    container.appendChild(i_);
  }
}

/* ============================================================
   SCENE 0 — INTRO
   ============================================================ */
const introHeart = document.getElementById('introHeart');
const heartGlow = document.getElementById('heartGlow');
const introTag = document.getElementById('introTag');
const introSub = document.getElementById('introSub');
const openBtn = document.getElementById('openBtn');

function playIntro(){
  spawnFloaters(document.getElementById('introFloaters'), 42, ['c-red','c-pink','c-red','c-pink','c-pink']);
  introTag.style.animation = 'fadeUp .8s ease forwards';
  setTimeout(()=>{
    introHeart.style.transition = 'transform .5s cubic-bezier(.3,1.4,.4,1), opacity .5s ease';
    introHeart.style.opacity = 1;
    introHeart.style.transform = 'scale(1)';
    introHeart.classList.add('beat');
    heartGlow.style.transition='width .6s ease,height .6s ease,opacity .6s ease';
    heartGlow.style.width='140px'; heartGlow.style.height='140px'; heartGlow.style.opacity=1;
    setInterval(()=>{
      heartGlow.style.opacity = heartGlow.style.opacity==1 ? .4 : 1;
    }, 900);
  }, 350);
  setTimeout(()=>{
    openBtn.style.transition='opacity .6s ease, transform .6s ease';
    openBtn.style.opacity=1; openBtn.style.transform='translateY(0)';
  }, 700);
  setTimeout(()=>{ introSub.style.animation='fadeUp .8s ease forwards'; }, 1000);
}
let started=false;
openBtn.addEventListener('click', e=>{
  if(started) return; started=true;
  heartsAt(e.clientX, e.clientY, 16);
  setTimeout(()=>{ show(idx('s-arrow')); playScene('s-arrow'); }, 420);
});

/* ============================================================
   SCENE 1 — ARROW HITS HEART (no caption, auto-advance)
   ============================================================ */
const bigHeart = document.getElementById('bigHeart');
const arrowIcon = document.getElementById('arrowIcon');
const burstHearts = document.getElementById('burstHearts');
const shockRing = document.getElementById('shockRing');
const impactFlash = document.getElementById('impactFlash');

function playArrowScene(){
  spawnFloaters(document.getElementById('arrowFloaters'), 32, ['c-red','c-pink','c-red','c-pink']);
  bigHeart.style.transform='scale(1)';
  bigHeart.style.filter='none';
  arrowIcon.style.transition='none';
  arrowIcon.style.opacity=1;
  arrowIcon.style.transform='translate(-42vw,38vh) rotate(-58deg)';
  burstHearts.innerHTML='';
  shockRing.style.transition='none';
  shockRing.style.transform='translate(-50%,-50%) scale(0)';
  shockRing.style.opacity=0;
  impactFlash.style.transition='none';
  impactFlash.style.opacity=0;
  void arrowIcon.offsetWidth;

  arrowIcon.style.transition='transform 1.05s cubic-bezier(.3,.5,.15,1), opacity .15s ease .95s';
  requestAnimationFrame(()=>{
    arrowIcon.style.transform='translate(0,0) rotate(-38deg)';
  });

  setTimeout(()=>{
    arrowIcon.style.opacity=0;

    /* impact flash */
    impactFlash.style.transition='none';
    impactFlash.style.opacity=.85;
    void impactFlash.offsetWidth;
    impactFlash.style.transition='opacity .45s ease-out';
    impactFlash.style.opacity=0;

    /* heart flinches then pops bigger, with a quick red glow */
    bigHeart.style.transition='transform .14s ease-out, filter .14s ease-out';
    bigHeart.style.transform='scale(.78) rotate(-4deg)';
    bigHeart.style.filter='drop-shadow(0 0 26px rgba(255,45,85,.85)) brightness(1.25)';
    setTimeout(()=>{
      bigHeart.style.transition='transform .55s cubic-bezier(.4,1.8,.4,1), filter .55s ease-out';
      bigHeart.style.transform='scale(1.22)';
      bigHeart.style.filter='none';
      setTimeout(()=>{ bigHeart.style.transition='transform .4s ease'; bigHeart.style.transform='scale(1.08)'; }, 260);
    }, 140);

    /* double shockwave ring for a bigger "burst" feel */
    shockRing.style.transition='none';
    shockRing.style.opacity=1;
    void shockRing.offsetWidth;
    shockRing.style.transition='transform .65s ease-out, opacity .65s ease-out';
    shockRing.style.transform='translate(-50%,-50%) scale(11)';
    shockRing.style.opacity=0;

    const colors=['#ff2d55','#f43e84','#ffb3d1','#ffffff'];
    const count=52;
    for(let i=0;i<count;i++){
      const h=document.createElement('i');
      h.textContent = Math.random()>.3 ? '♥' : '♡';
      const angle=(Math.PI*2*i)/count + (Math.random()*.3-.15), dist=100+Math.random()*130;
      h.style.fontSize=(12+Math.random()*20)+'px';
      h.style.color = colors[Math.floor(Math.random()*colors.length)];
      burstHearts.appendChild(h);
      h.style.transition = `transform ${.8+Math.random()*.5}s cubic-bezier(.2,.7,.3,1), opacity ${.8+Math.random()*.5}s ease-out`;
      h.style.opacity=1;
      h.style.transform='translate(-50%,-50%) scale(.5) rotate(0deg)';
      requestAnimationFrame(()=>{
        h.style.transform=`translate(calc(-50% + ${Math.cos(angle)*dist}px), calc(-50% + ${Math.sin(angle)*dist}px)) scale(1.15) rotate(${Math.random()*60-30}deg)`;
        h.style.opacity=0;
      });
    }
  }, 1050);

  goTo('s-photo1', 2500);
}

/* ============================================================
   SCENE 2 — FIRST PHOTO REVEAL (blur to focus + ken burns)
   ============================================================ */
function playPhotoReveal(imgEl, shadeEl, sparkleEl, copySelector){
  imgEl.classList.remove('focused','kenburns');
  shadeEl.classList.remove('show');
  sparkleEl.classList.remove('show');
  const copyEls = document.querySelectorAll(copySelector+' > *');
  copyEls.forEach(el=>{ el.style.opacity=0; el.style.animation='none'; });

  requestAnimationFrame(()=>{
    imgEl.classList.add('focused');
    setTimeout(()=> imgEl.classList.add('kenburns'), 50);
  });
  setTimeout(()=> shadeEl.classList.add('show'), 300);
  setTimeout(()=> sparkleEl.classList.add('show'), 1100);
  copyEls.forEach((el,i)=>{
    setTimeout(()=>{ el.style.animation=`fadeUp .7s ease forwards`; }, 900 + i*180);
  });
}
function playPhoto1(){
  playPhotoReveal(
    document.getElementById('photo1Img'),
    document.getElementById('photo1Shade'),
    document.getElementById('photo1Sparkle'),
    '#s-photo1 .photo-copy'
  );
}
function playAgainScene(){
  playPhotoReveal(
    document.getElementById('againImg'),
    document.getElementById('againShade'),
    document.getElementById('againSparkle'),
    '#s-again .photo-copy'
  );
}

/* ============================================================
   SCENE 3 — YOU ARE MINE
   ============================================================ */
const wordYou = document.getElementById('wordYou');
const wordAre = document.getElementById('wordAre');
const wordMine = document.getElementById('wordMine');
const mineTag = document.getElementById('mineTag');
const mineSubText = document.getElementById('mineSubText');
const underlinePath = document.getElementById('underlinePath');
const mineShakeTarget = document.getElementById('mineShakeTarget');

function playMineScene(){
  spawnFloaters(document.getElementById('mineFloaters'), 22, ['c-red','c-pink','c-white']);
  [wordYou,wordAre,wordMine].forEach(w=>{
    w.style.opacity=0; w.style.transform='translateY(24px) rotateX(45deg)';
  });
  wordMine.classList.remove('run');
  mineTag.style.opacity=0;
  mineSubText.style.opacity=0;
  underlinePath.style.strokeDashoffset=160;
  underlinePath.style.transition='none';

  mineTag.style.transition='opacity .6s ease';
  setTimeout(()=> mineTag.style.opacity=1, 150);

  const words=[wordYou,wordAre,wordMine];
  words.forEach((w,i)=>{
    setTimeout(()=>{
      w.style.transition='transform .55s cubic-bezier(.2,1.3,.3,1), opacity .5s ease';
      w.style.opacity=1;
      w.style.transform='translateY(0) rotateX(0)';
      if(w===wordMine){
        setTimeout(()=>{
          wordMine.classList.add('run');
          mineShakeTarget.classList.add('shaking');
          setTimeout(()=>mineShakeTarget.classList.remove('shaking'), 350);
        }, 550);
      }
    }, 500 + i*380);
  });

  setTimeout(()=>{
    underlinePath.style.transition='stroke-dashoffset 1s cubic-bezier(.4,.1,.2,1)';
    underlinePath.style.strokeDashoffset=0;
  }, 500 + words.length*380 + 350);

  setTimeout(()=>{
    mineSubText.style.transition='opacity .8s ease';
    mineSubText.style.opacity=1;
  }, 500 + words.length*380 + 900);

  goTo('s-cute', 3800);
}

/* ============================================================
   SCENE 4 — YOU'RE CUTE
   ============================================================ */
function makeHeartBubbleBurst(holder, count=24){
  if(!holder) return;
  holder.innerHTML='';
  const chars=['♥','♡','♥','♡','✦'];
  for(let i=0;i<count;i++){
    const h=document.createElement('i');
    h.textContent=chars[Math.floor(Math.random()*chars.length)];
    const a=(Math.PI*2*i)/count + (Math.random()-.5)*.35;
    h.style.setProperty('--bx', `${Math.cos(a)*(55+Math.random()*105)}px`);
    h.style.setProperty('--by', `${Math.sin(a)*(45+Math.random()*95)}px`);
    h.style.setProperty('--bs', `${.65+Math.random()*.8}`);
    h.style.setProperty('--br', `${Math.random()*80-40}deg`);
    h.style.fontSize=`${10+Math.random()*17}px`;
    if(Math.random()>.76) h.classList.add('gold');
    else if(Math.random()>.83) h.classList.add('white');
    holder.appendChild(h);
  }
  holder.classList.remove('active');
  void holder.offsetWidth;
  holder.classList.add('active');
}

function playCuteScene(){
  spawnFloaters(document.getElementById('cuteFloaters'), 14, ['c-red','c-pink','c-white']);
  const confetti = document.getElementById('cuteConfetti');
  confetti.innerHTML='';
  for(let i=0;i<44;i++){
    const c=document.createElement('i');
    if(Math.random()>.7) c.classList.add('round');
    c.style.left=`${Math.random()*100}%`;
    c.style.animationDuration=`${2.3+Math.random()*2.2}s`;
    c.style.animationDelay=`${Math.random()*1.2}s`;
    c.style.transform=`rotate(${Math.random()*360}deg)`;
    confetti.appendChild(c);
  }
  const card = document.getElementById('cuteCard');
  card.classList.remove('pop');
  void card.offsetWidth;
  card.classList.add('pop');

  const tag=document.getElementById('cuteTag'), title=document.getElementById('cuteTitle'),
        sub=document.getElementById('cuteSub'), fine=document.getElementById('cuteFine'),
        hearts=document.getElementById('cuteHearts');
  [tag,title,sub,fine,hearts].forEach(el=>{ el.style.opacity=0; el.style.animation='none'; });
  title.classList.remove('wobble');

  setTimeout(()=>{ tag.style.animation='fadeUp .6s ease forwards'; }, 500);
  setTimeout(()=>{ title.classList.add('wobble'); }, 750);
  setTimeout(()=>{ sub.style.animation='fadeUp .6s ease forwards'; }, 1150);
  setTimeout(()=>{ fine.style.animation='fadeUp .6s ease forwards'; }, 1400);
  const photoOrb=document.getElementById('cutePhotoOrb');
  const burst=document.getElementById('cuteFingerBurst');
  photoOrb.classList.remove('show');
  setTimeout(()=>{ photoOrb.classList.add('show'); makeHeartBubbleBurst(burst,28); }, 520);
  photoOrb.onclick=()=>makeHeartBubbleBurst(burst,34);
  setTimeout(()=>{ hearts.style.animation='fadeUp .6s ease forwards'; }, 1650);
}

/* ============================================================
   SCENE 4.5 — PHOTO MAGIC
   ============================================================ */
const photoMagicCard=document.getElementById('photoMagicCard');
const photoMagicBurst=document.getElementById('photoMagicBurst');
function playPhotoMagicScene(){
  photoMagicCard.classList.remove('in');
  void photoMagicCard.offsetWidth;
  photoMagicCard.classList.add('in');
  setTimeout(()=>makeHeartBubbleBurst(photoMagicBurst,34),850);
}
photoMagicCard.addEventListener('click',e=>{
  makeHeartBubbleBurst(photoMagicBurst,42);
  heartsAt(e.clientX,e.clientY,10);
});

/* ============================================================
   SCENE 5 — PROPOSAL (No dodges, Yes -> muah popup)
   ============================================================ */
const btnYes = document.getElementById('btnYes');
const btnNo = document.getElementById('btnNo');
const muahOverlay = document.getElementById('muahOverlay');
let noHits = 0;

function resetNoBtn(){
  const w=window.innerWidth, h=window.innerHeight;
  btnNo.style.left = `${w/2 + 66}px`;
  btnNo.style.top = `${h/2 + 100}px`;
}
function dodgeNo(){
  const r=btnYes.getBoundingClientRect();
  const angle=Math.random()*Math.PI*2, dist=80+Math.random()*130;
  const x=Math.max(18,Math.min(window.innerWidth-95,r.left+r.width/2+Math.cos(angle)*dist-45));
  const y=Math.max(70,Math.min(window.innerHeight-65,r.top+r.height/2+Math.sin(angle)*dist-24));
  btnNo.style.left = `${x}px`; btnNo.style.top = `${y}px`;
  noHits++; btnYes.classList.add('grow');
}
btnNo.addEventListener('pointerenter', dodgeNo);
btnNo.addEventListener('pointerdown', e=>{ e.preventDefault(); dodgeNo(); });
btnNo.addEventListener('click', e=>{ e.preventDefault(); dodgeNo(); });
btnNo.addEventListener('touchstart', e=>{ e.preventDefault(); dodgeNo(); }, {passive:false});

function playProposalScene(){
  spawnFloaters(document.getElementById('proposalFloaters'), 16, ['c-pink','c-white']);
  resetNoBtn();
  btnYes.classList.remove('grow');
  noHits=0;
  const tag=document.getElementById('propTag'), title=document.getElementById('propTitle'),
        sub=document.getElementById('propSub'), buttons=document.getElementById('propButtons');
  [tag,title,sub,buttons].forEach(el=>{ el.style.opacity=0; el.style.animation='none'; });
  setTimeout(()=>{ tag.style.animation='fadeUp .6s ease forwards'; }, 200);
  setTimeout(()=>{ title.style.animation='fadeUp .6s ease forwards'; }, 380);
  setTimeout(()=>{ sub.style.animation='fadeUp .6s ease forwards'; }, 560);
  setTimeout(()=>{ buttons.style.animation='fadeUp .6s ease forwards'; }, 800);
}
btnYes.addEventListener('click', e=>{
  heartsAt(e.clientX, e.clientY, 26);
  muahOverlay.classList.add('show');
  setTimeout(()=>{
    muahOverlay.classList.remove('show');
    show(idx('s-truth')); playScene('s-truth');
  }, 2100);
});

/* ============================================================
   SCENE 6 — TRUTH
   ============================================================ */
const truthTag = document.getElementById('truthTag');
const truthTitle = document.getElementById('truthTitle');
const truthPulse = document.getElementById('truthPulse');
const btnTruthYes = document.getElementById('btnTruthYes');
const btnTruthNo = document.getElementById('btnTruthNo');
const truthLoveLines = document.getElementById('truthLoveLines');
function resetTruthNo(){ const r=btnTruthYes.getBoundingClientRect(); btnTruthNo.style.left=`${r.right+14}px`; btnTruthNo.style.top=`${r.top}px`; }
function dodgeTruthNo(){ const r=btnTruthYes.getBoundingClientRect(), a=Math.random()*Math.PI*2, d=75+Math.random()*120; btnTruthNo.style.left=`${Math.max(15,Math.min(innerWidth-90,r.left+r.width/2+Math.cos(a)*d-40))}px`; btnTruthNo.style.top=`${Math.max(65,Math.min(innerHeight-60,r.top+r.height/2+Math.sin(a)*d-24))}px`; }
['pointerenter','pointerdown','click','touchstart'].forEach(type=>btnTruthNo.addEventListener(type,e=>{e.preventDefault();dodgeTruthNo();},{passive:false}));
function playTruthScene(){
  spawnFloaters(document.getElementById('truthFloaters'), 24, ['c-red','c-pink','c-red','c-pink']);
  [truthTag,truthLoveLines,truthTitle,truthPulse,btnTruthYes].forEach(el=>{ el.style.opacity=0; el.style.animation='none'; });
  btnTruthNo.style.opacity=0; resetTruthNo();
  setTimeout(()=>truthTag.style.animation='fadeUp .6s ease forwards',150);
  setTimeout(()=>truthLoveLines.style.animation='fadeUp .7s ease forwards',300);
  setTimeout(()=>truthTitle.style.animation='fadeUp .8s ease forwards',520);
  setTimeout(()=>truthPulse.style.animation='fadeUp .5s ease forwards, heartbeat 1.4s ease-in-out infinite 1.2s',1050);
  setTimeout(()=>{btnTruthYes.style.animation='fadeUp .6s ease forwards';btnTruthNo.style.opacity=1;},1300);
}
btnTruthYes.addEventListener('click', e=>{ heartsAt(e.clientX,e.clientY,30); goTo('s-gift',700); });


/* ============================================================
   VIDEO-INSPIRED CHAPTERS
   ============================================================ */
const giftBoxWrap=document.getElementById('giftBoxWrap');
const giftNext=document.getElementById('giftNext');
function playGiftScene(){
  spawnFloaters(document.getElementById('giftFloaters'),28,['c-pink','c-red','c-white']);
  const tag=document.getElementById('giftTag'), box=document.getElementById('giftBoxWrap'),
        title=document.getElementById('giftTitle'), sub=document.getElementById('giftSub'), next=document.getElementById('giftNext');
  [tag,title,sub,next].forEach(el=>{el.style.opacity=0;el.style.animation='none'});
  box.classList.remove('ready','opened');
  setTimeout(()=>{tag.style.animation='fadeUp .6s ease forwards'},120);
  setTimeout(()=>{box.classList.add('ready')},320);
  setTimeout(()=>{title.style.animation='fadeUp .7s ease forwards'},700);
  setTimeout(()=>{sub.style.animation='fadeUp .6s ease forwards'},900);
  setTimeout(()=>{next.style.animation='fadeUp .6s ease forwards'},1150);
}
function openGift(){
  giftBoxWrap.classList.add('opened');
  heartsAt(innerWidth/2,innerHeight*.45,22);
  showToast('there is a little more waiting for you ♡',1800);
}
giftBoxWrap.addEventListener('click',openGift);
giftBoxWrap.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openGift();}});

function playMemoriesScene(){
  spawnFloaters(document.getElementById('galleryFloaters') || document.body, 12, ['c-pink','c-red','c-white']);
  const els=[document.getElementById('memTag'),document.getElementById('memTitle'),document.getElementById('memSub')];
  els.forEach((el,i)=>{el.style.opacity=0;el.style.animation='none';setTimeout(()=>el.style.animation='fadeUp .6s ease forwards',120+i*180)});
  [...document.querySelectorAll('#memoryGrid figure')].forEach((el,i)=>{el.classList.remove('show');setTimeout(()=>el.classList.add('show'),600+i*140)});
}

function playFeltScene(){
  const card=document.getElementById('feltCard'); card.classList.remove('in'); void card.offsetWidth; card.classList.add('in');
}
function playNoteScene(){
  const card=document.getElementById('notePaper'); card.classList.remove('in'); void card.offsetWidth; card.classList.add('in');
  const holder=document.getElementById('noteParticles');
  holder.innerHTML=Array.from({length:20}).map((_,i)=>`<i style="position:absolute;left:${Math.random()*100}%;top:${Math.random()*100}%;color:#d94b7f;opacity:${.12+Math.random()*.35};font-size:${10+Math.random()*14}px;animation:twinkle ${2+Math.random()*3}s ease-in-out infinite ${Math.random()*2}s">✦</i>`).join('');
}
/* ============================================================
   SCENE 12 — QUEEN SPOTLIGHT
   ============================================================ */
const queenPhotos=[
 {src:'assets/photo-01.jpg',cap:'vo pehli mulaqat ♡',head:'my <em>queen</em> ♕'},
 {src:'assets/photo-04.jpg',cap:'hamesha yaad rahega',head:'simply <em>beautiful</em>'},
 {src:'assets/photo-03.jpg',cap:'ye smile hi toh sab kuch hai',head:'pure <em>magic</em> ✦'},
 {src:'assets/photo-09.jpg',cap:'chhoti si baat, badi si khushi',head:'always <em>adorable</em>'},
 {src:'assets/photo-06.jpg',cap:'har pal khaas',head:'my <em>favourite</em> face'},
 {src:'assets/photo-05.jpg',cap:'tumhare bina adhoora',head:'forever <em>special</em>'}
];
const cardStack=document.getElementById('cardStack'),queenCaption=document.getElementById('queenCaption'),queenHint=document.getElementById('queenHint'),queenTitleEl=document.getElementById('queenTitle'),queenDots=document.getElementById('queenDots');
let qTop=0,qAutoTimer=null,qBuilt=false;
function buildQueenStack(){cardStack.innerHTML='<div class="q-card q-top dropped"><img alt="A beautiful memory"><div class="q-shine"></div></div>'; if(queenDots) queenDots.innerHTML=queenPhotos.map((_,i)=>`<i data-i="${i}"></i>`).join(''); qBuilt=true;}
function renderQueen(){const p=queenPhotos[qTop],card=cardStack.firstElementChild;card.querySelector('img').src=p.src;queenCaption.innerHTML=`<span class="show">${p.cap}</span>`;queenTitleEl.innerHTML=p.head;queenTitleEl.style.animation='none';void queenTitleEl.offsetWidth;queenTitleEl.style.animation='fadeUp .5s ease forwards';if(queenDots)[...queenDots.children].forEach((d,i)=>d.classList.toggle('active',i===qTop));}
function nextQueen(){const card=cardStack.firstElementChild;if(!card)return;card.classList.add('flipping');setTimeout(()=>{qTop=(qTop+1)%queenPhotos.length;renderQueen();card.classList.remove('flipping');heartsAt(innerWidth/2,innerHeight*.42,8);},280)}
function playQueenScene(){document.getElementById('queenGlitter').innerHTML=Array.from({length:26}).map(()=>`<i style="left:${Math.random()*100}%;top:${Math.random()*100}%;animation-delay:${Math.random()*3}s">✦</i>`).join('');const crown=document.getElementById('queenCrown');crown.style.opacity=0;queenHint.style.opacity=0;if(!qBuilt)buildQueenStack();qTop=0;renderQueen();setTimeout(()=>crown.style.animation='fadeUp .6s cubic-bezier(.2,1.3,.3,1) forwards',120);setTimeout(()=>queenHint.style.animation='fadeUp .6s ease forwards',750);cardStack.onclick=nextQueen;if(qAutoTimer)clearInterval(qAutoTimer);qAutoTimer=setInterval(()=>{if(document.getElementById('s-queen').classList.contains('active'))nextQueen();},4200);}

/* ============================================================
   SCENE 8 — POLAROID GALLERY
   ============================================================ */
/* every uploaded photo goes in, except photo-08 (that's the muah one) */
const polaroidPhotos = [
  {src:'assets/photo-01.jpg', cap:'hamesha yaad'},
  {src:'assets/photo-02.jpg', cap:'vo din ♡'},
  {src:'assets/photo-03.jpg', cap:'yun hi rehna ♡'},
  {src:'assets/photo-04.jpg', cap:'muskurahat'},
  {src:'assets/photo-05.jpg', cap:'wo pal ♡'},
  {src:'assets/photo-06.jpg', cap:'itni cute kaise ho'},
  {src:'assets/photo-07.jpg', cap:'pehli baar'},
  {src:'assets/photo-09.jpg', cap:'wo lamha'},
];
const polaroidField = document.getElementById('polaroidField');
let polBuilt=false;
let focusedPol = null;

function buildPolaroids(){
  polaroidField.innerHTML='';
  polaroidPhotos.forEach((p,i)=>{
    const el=document.createElement('div');
    el.className='polaroid';
    el.style.setProperty('--rot', ((i%2===0?-1:1)*(2+Math.random()*4))+'deg');
    el.innerHTML = `<img src="${p.src}" alt=""><div class="cap">${p.cap}</div>`;
    el.addEventListener('click', ()=>toggleFocus(el));
    polaroidField.appendChild(el);
  });
  polBuilt=true;
}
function toggleFocus(el){
  const all=[...polaroidField.children];
  if(focusedPol===el){
    all.forEach(p=>p.classList.remove('dim'));
    el.classList.remove('focused');
    focusedPol=null;
    return;
  }
  all.forEach(p=>{
    if(p===el){ p.classList.add('focused'); p.classList.remove('dim'); }
    else { p.classList.remove('focused'); p.classList.add('dim'); }
  });
  focusedPol=el;
  const r=el.getBoundingClientRect();
  heartsAt(r.left+r.width/2, r.top+r.height/2, 5);
}

function playGalleryScene(){
  spawnFloaters(document.getElementById('galleryFloaters'), 12, ['c-red','c-pink','c-white']);
  const tag=document.getElementById('galTag'), title=document.getElementById('galTitle'), sub=document.getElementById('galSub'), counter=document.getElementById('galCounter');
  if(tag) { tag.style.opacity=0; setTimeout(()=>{ tag.style.animation='fadeUp .6s ease forwards'; }, 150); }
  if(title) { title.style.opacity=0; setTimeout(()=>{ title.style.animation='fadeUp .6s ease forwards'; }, 380); }
  if(sub) { sub.style.opacity=0; setTimeout(()=>{ sub.style.animation='fadeUp .6s ease forwards'; }, 560); }
  if(counter){ counter.style.opacity=0; setTimeout(()=>{ counter.style.animation='fadeUp .5s ease forwards'; }, 720); }

  if(!polBuilt) buildPolaroids();
  const cards=[...polaroidField.children];
  cards.forEach(c=>{ c.classList.remove('fall-in','focused','dim'); c.style.opacity=0; });
  focusedPol=null;

  /* falls in from the top once, then stays put — no continuous sway */
  cards.forEach((c,i)=>{
    setTimeout(()=>{ c.classList.add('fall-in'); }, 700 + i*140);
  });
}

/* ============================================================
   SCENE 11.5 — PHOTO ORBIT
   ============================================================
function playPhotoOrbitScene(){
  const photos=[...document.querySelectorAll('#photoOrbit .orbit-photo')];
  photos.forEach((p,i)=>{p.style.animation='none';p.style.opacity=0;setTimeout(()=>{p.style.animation=`fadeUp .8s cubic-bezier(.2,1.1,.3,1) forwards`;},180+i*220);});
  const cap=document.getElementById('orbitCaption');
  if(cap){cap.style.opacity=0;setTimeout(()=>cap.style.animation='fadeUp .7s ease forwards',900);}
  setTimeout(()=>heartsAt(innerWidth/2,innerHeight*.45,18),1100);
}

/* ============================================================
   SCENE 9 — FINAL LETTER
   ============================================================ */
const letterCard = document.getElementById('letterCard');
const heartRing = document.getElementById('heartRing');
const replyBtn = document.getElementById('replyBtn');
const replyText = document.getElementById('replyText');
const replayBtn = document.getElementById('replayBtn');

const replies = [
  "aww, main bhi tumhe utna hi chahta/chahti hoon. 🥰",
  "tumhare bina din adhoora lagta hai. ❤️",
  "you make ordinary days feel special. ✨",
  "hamesha aise hi muskurate rehna, promise? 😊",
  "tumhari yeh cuteness hi toh sabse badi problem hai. 😄",
  "grateful to have you, always. 💫",
  "tum ho toh sab kuch thoda aur khoobsurat lagta hai. 🌸",
  "is dil pe bas tumhara hi naam likha hai. ♡"
];
let lastReply=-1;

function playLetterScene(){
  spawnFloaters(document.getElementById('letterFloaters'), 14, ['c-red','c-pink','c-white']);
  const letterPhoto=document.getElementById('letterPhotoWrap');
  letterPhoto.classList.remove('show');
  letterCard.classList.remove('in');
  void letterCard.offsetWidth;
  letterCard.classList.add('in');
  replyText.textContent='';
  replyText.classList.remove('filled');

  const els = ['letterTag','letterHeading','finalHeart','letterText','finalLine','letterBtns']
    .map(id=>document.getElementById(id));
  els.forEach(el=>{ el.style.opacity=0; el.style.animation='none'; });
  document.getElementById('finalHeart').classList.remove('beat');
  const signature = document.getElementById('letterSignature');
  signature.style.opacity=0; signature.style.animation='none';

  setTimeout(()=>{ letterPhoto.classList.add('show'); makeHeartBubbleBurst(document.getElementById('letterFingerBurst'),26); }, 350);
  setTimeout(()=>{ els[0].style.animation='fadeUp .6s ease forwards'; }, 500);
  setTimeout(()=>{ els[1].style.animation='fadeUp .7s ease forwards'; }, 750);
  setTimeout(()=>{
    els[2].style.animation='fadeUp .5s ease forwards';
    document.getElementById('finalHeart').classList.add('beat');
  }, 1150);
  setTimeout(()=>{ els[3].style.animation='fadeUp .8s ease forwards'; }, 1400);
  setTimeout(()=>{ els[4].style.animation='fadeUp .6s ease forwards'; }, 1900);
  setTimeout(()=>{ signature.style.animation='fadeUp .6s ease forwards'; }, 2100);
  setTimeout(()=>{ els[5].style.animation='fadeUp .6s ease forwards'; }, 2300);

  setTimeout(()=>{
    heartRing.style.transition='none';
    heartRing.style.width='0'; heartRing.style.height='0'; heartRing.style.opacity=1;
    void heartRing.offsetWidth;
    heartRing.style.transition='width 1s ease-out, height 1s ease-out, opacity 1s ease-out';
    heartRing.style.width='240px'; heartRing.style.height='240px'; heartRing.style.opacity=0;
    const rect = letterCard.getBoundingClientRect();
    heartsAt(rect.left+rect.width/2, rect.top+40, 20);
  }, 2300);

  showToast('made with a ridiculous amount of love ♡', 3200);
}
replyBtn.addEventListener('click', e=>{
  heartsAt(e.clientX, e.clientY, 10);
  let i = Math.floor(Math.random()*replies.length);
  if(i===lastReply) i=(i+1)%replies.length;
  lastReply=i;
  replyText.classList.add('filled');
  replyText.style.animation='none';
  void replyText.offsetWidth;
  replyText.textContent = replies[i];
  replyText.style.animation='fadeUp .5s ease forwards';
});
replayBtn.addEventListener('click', e=>{
  heartsAt(e.clientX, e.clientY, 16);
  started=false;
  setTimeout(()=>{ show(0); playScene('s-intro'); }, 400);
});

/* ============================================================
   SOUND (ambient synth, unchanged behaviour)
   ============================================================ */
let audioCtx=null, ambienceOn=false;
const soundBtn=document.getElementById('soundBtn');
function startAmbience(){
  if(ambienceOn) return; ambienceOn=true;
  try{
    audioCtx = new (window.AudioContext||window.webkitAudioContext)();
    const master=audioCtx.createGain(); master.gain.value=.018;
    master.connect(audioCtx.destination);
    [261.63,329.63,392,523.25].forEach((freq,i)=>{
      const osc=audioCtx.createOscillator(), gain=audioCtx.createGain();
      osc.type='sine'; osc.frequency.value=freq; gain.gain.value=0;
      osc.connect(gain); gain.connect(master); osc.start();
      const now=audioCtx.currentTime;
      gain.gain.linearRampToValueAtTime(.35, now+1.2+i*.25);
      gain.gain.linearRampToValueAtTime(.04, now+4.5+i*.25);
    });
    soundBtn.textContent='♫';
  }catch(e){}
}
function toggleSound(){
  if(!audioCtx){ startAmbience(); return; }
  if(audioCtx.state==='running'){ audioCtx.suspend(); soundBtn.textContent='♪'; }
  else { audioCtx.resume(); soundBtn.textContent='♫'; }
}
soundBtn.addEventListener('click', toggleSound);

/* ============================================================
   SCENE ORCHESTRATION
   ============================================================ */
function playScene(id){
  if(id==='s-intro') playIntro();
  if(id==='s-arrow') playArrowScene();
  if(id==='s-photo1') playPhoto1();
  if(id==='s-mine') playMineScene();
  if(id==='s-cute') playCuteScene();
  if(id==='s-photo-magic') playPhotoMagicScene();
  if(id==='s-proposal') playProposalScene();
  if(id==='s-truth') playTruthScene();
  if(id==='s-gift') playGiftScene();
  if(id==='s-memories') playMemoriesScene();
  if(id==='s-felt') playFeltScene();
  if(id==='s-note') playNoteScene();
  if(id==='s-queen') playQueenScene();
  if(id==='s-gallery') playGalleryScene();
  if(id==='s-photo-orbit') playPhotoOrbitScene();
  if(id==='s-again') playAgainScene();
  if(id==='s-letter') playLetterScene();
}

document.addEventListener('click', e=>{
  if(e.target.closest('button')) return;
  if(Math.random()<.2) heartsAt(e.clientX, e.clientY, 3);
});

show(0);
playIntro();

/* ============================================================
   MASTERPIECE PASS — tiny interactive details
   ============================================================ */
(function(){
  const sceneMeta={
    's-intro':['01','THE INVITATION'],
    's-arrow':['02','A LITTLE MAGIC'],
    's-photo1':['03','THE FIRST LOOK'],
    's-mine':['04','JUST FOR YOU'],
    's-cute':['05','A LITTLE TRUTH'],
    's-photo-magic':['06','ONE MORE LOOK'],
    's-proposal':['07','THE QUESTION'],
    's-truth':['08','BE HONEST'],
    's-gift':['09','A TINY SURPRISE'],
    's-memories':['10','SWEETEST MEMORIES'],
    's-queen':['11','MY QUEEN'],
    's-gallery':['12','OUR MEMORIES'],
    's-photo-orbit':['13','A FEW MORE'],
    's-felt':['14','THIS PHOTO FELT'],
    's-note':['15','FROM MY HEART'],
    's-again':['16','ONE MORE LOOK'],
    's-letter':['17','ONE LAST THING']
  };
  Object.entries(sceneMeta).forEach(([id,m])=>{
    const s=document.getElementById(id); if(!s) return;
    let label=s.querySelector('.scene-number');
    if(!label){
      label=document.createElement('div');
      label.className='scene-number';
      label.innerHTML=`<span>${m[0]}</span><b>${m[1]}</b>`;
      s.appendChild(label);
    }
  });

  /* richer pointer glow, intentionally subtle */
  const glow=document.createElement('div'); glow.className='cursor-glow'; document.body.appendChild(glow);
  let mx=-200,my=-200;
  window.addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;glow.style.transform=`translate3d(${mx}px,${my}px,0)`},{passive:true});

  /* premium click sparkle without altering the existing heart effects */
  document.addEventListener('click',e=>{
    if(e.target.closest('.sound-btn')) return;
    const s=e.target.closest('.scene'); if(!s) return;
    const p=document.createElement('span'); p.className='click-spark';
    p.style.left=e.clientX+'px'; p.style.top=e.clientY+'px';
    p.textContent='✦'; document.body.appendChild(p);
    setTimeout(()=>p.remove(),700);
  },true);
})();
