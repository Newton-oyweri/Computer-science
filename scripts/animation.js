const efbCard = document.getElementById('efbCard');
const paiCard = document.getElementById('paiCard');
const paiModal = document.getElementById('paiModal');
const joinBtn = document.getElementById('joinPaiBtn');

// Slide animation sequence
efbCard.style.opacity = 0;
paiCard.style.opacity = 0;

setTimeout(()=> {
  efbCard.style.animation = 'slideFromLeft 0.8s forwards';
}, 500);

setTimeout(()=> {
  paiCard.style.animation = 'slideFromRight 0.8s forwards';
}, 1000);

// eFootball click
efbCard.addEventListener('click', ()=>window.open('https://efootballkenyaleague.website','_blank'));

// P-AI modal
paiCard.addEventListener('click', ()=>paiModal.style.display='flex');
joinBtn.addEventListener('click', ()=> {
  window.open("https://chat.whatsapp.com/Dbn9vdB4hzC8A7ccILXNd4?mode=gi_t","_blank");
  paiModal.style.display='none';
});
paiModal.addEventListener('click', e=>{if(e.target===paiModal)paiModal.style.display='none';});

// Mock download tracker (example)
function trackDownload(){
  const countEl = document.getElementById('downloads');
  let current = parseInt(countEl.textContent) || 0;
  current += 1;
  countEl.textContent = current + " downloads";
}


