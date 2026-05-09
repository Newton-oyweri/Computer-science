/* --- Supabase Logic --- */
const SUPABASE_URL = "https://syrngdhiefxvxkloxyjc.supabase.co";
const SUPABASE_KEY = "sb_publishable_Mt2LZbiyEUaezzJzhuHW2Q_98MmnxgU";
const APK_URL = "https://github.com/Newton-oyweri/cshub/releases/download/v0.045/cshub.apk";

async function loadDownloads(){
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/downloads?app_name=eq.cshub&select=download_count`,
      {
        headers:{
          "apikey": SUPABASE_KEY,
          "Authorization": "Bearer " + SUPABASE_KEY
        }
      }
    );
    const data = await res.json();
    if(data.length>0){
      document.getElementById("downloads").innerText = data[0].download_count + " downloads";
    } else {
      document.getElementById("downloads").innerText = "0 downloads";
    }
  } catch(err){
    console.error(err);
    document.getElementById("downloads").innerText = "Error";
  }
}

async function trackDownload(){
  try {
    await fetch(
      `${SUPABASE_URL}/rest/v1/rpc/increment_download`,
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "apikey": SUPABASE_KEY,
          "Authorization": "Bearer " + SUPABASE_KEY
        },
        body: JSON.stringify({app:"cshub"})
      }
    );
    loadDownloads();
    window.location.href = APK_URL;
  } catch(err){
    console.error(err);
    alert("Download failed");
  }
}

// Initial count load
loadDownloads();

/* --- Original Canvas Logic --- */
const canvas=document.getElementById("c");
const ctx=canvas.getContext("2d");
const intro=document.getElementById("intro");
const tapText=document.getElementById("tapText");

let w=canvas.width=window.innerWidth;
let h=canvas.height=window.innerHeight;

window.addEventListener("resize",()=>{
  w=canvas.width=window.innerWidth;
  h=canvas.height=window.innerHeight;
});

const cx=w/2;
const cy=h/2;

let titleY=-300;
let titleVel=0;
const gravity=0.65;
const bounce=-0.68;
const friction=0.88;

let hasBounced=false;
let spiralStart=false;
let spiralFinished=false;

let nodes = [];
const nodeCount = 35;

for(let i=0;i<nodeCount;i++){
  nodes.push({
    x: Math.random()*w,
    y: Math.random()*h,
    vx: (Math.random()-0.5)*1.2,
    vy: (Math.random()-0.5)*1.2
  });
}

function updateTitle(){
  if(spiralStart) return;
  titleVel += gravity;
  titleY += titleVel;
  const floor = h/2-80;
  if(titleY >= floor){
    titleY = floor;
    titleVel *= bounce;
    if(Math.abs(titleVel)<2.5){
      titleVel = 0;
      titleY = floor;
      hasBounced = true;
      setTimeout(()=>{ spiralStart=true; },400);
    }else{
      titleVel *= friction;
    }
  }
  intro.style.top = titleY+"px";
  intro.style.opacity = hasBounced?1:Math.min(1,(titleY+200)/400);
}

let ripples=[];
class Ripple{
  constructor(x,y){
    this.x=x; this.y=y; this.r=0; this.alpha=0.9;
  }
  update(){
    this.r+=2.4;
    this.alpha-=0.008;
  }
  draw(){
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
    ctx.strokeStyle=`rgba(0,255,170,${this.alpha})`;
    ctx.lineWidth=2.8;
    ctx.stroke();
  }
}

let angle=0;
let radius=0;
const maxRadius=Math.min(w,h)*0.48;

function drawNodes(){
  for(let i=0;i<nodes.length;i++){
    let n = nodes[i];
    n.x += n.vx;
    n.y += n.vy;
    if(n.x<0 || n.x>w) n.vx*=-1;
    if(n.y<0 || n.y>h) n.vy*=-1;
    ctx.beginPath();
    ctx.arc(n.x,n.y,2,0,Math.PI*2);
    ctx.fillStyle = 'rgba(0,255,150,0.7)';
    ctx.fill();
  }
  for(let i=0;i<nodes.length;i++){
    for(let j=i+1;j<nodes.length;j++){
      let dx = nodes[i].x - nodes[j].x;
      let dy = nodes[i].y - nodes[j].y;
      let dist = Math.sqrt(dx*dx+dy*dy);
      if(dist<120){
        ctx.beginPath();
        ctx.moveTo(nodes[i].x,nodes[i].y);
        ctx.lineTo(nodes[j].x,nodes[j].y);
        ctx.strokeStyle='rgba(0,255,150,'+(1-dist/120)*0.3+')';
        ctx.lineWidth=1;
        ctx.stroke();
      }
    }
  }
}

function animate(){
  ctx.fillStyle="rgba(0,0,0,0.22)";
  ctx.fillRect(0,0,w,h);
  drawNodes();
  updateTitle();

  if(spiralStart && radius<maxRadius){
    const x=cx+radius*Math.cos(angle);
    const y=cy+radius*Math.sin(angle);
    ripples.push(new Ripple(x,y));
    angle +=0.095;
    radius +=0.38;
  }

  if(radius>=maxRadius && !spiralFinished){
    spiralFinished=true;
    tapText.style.opacity=1;
  }

  for(let i=ripples.length-1;i>=0;i--){
    let r=ripples[i];
    r.update();
    r.draw();
    if(r.alpha<=0.02) ripples.splice(i,1);
  }
  requestAnimationFrame(animate);
}

animate();

canvas.addEventListener("click",(e)=>{
  if(!spiralFinished) return;
  ripples.push(new Ripple(e.clientX,e.clientY));
});
canvas.addEventListener("touchstart",(e)=>{
  if(!spiralFinished) return;
  let t=e.touches[0];
  ripples.push(new Ripple(t.clientX,t.clientY));
});

let currentReplyTo = null;

// Toggle overlay
function toggleInquiry() {
    const overlay = document.getElementById('inquiryOverlay');
    const btn = document.getElementById('floatingBtn');
    overlay.classList.toggle('open');
    btn.classList.toggle('hidden');
    
    if (overlay.classList.contains('open')) {
        fetchComments();
    } else {
        resetReplyMode();
    }
}

// Fetch and display comments with 1-level replies
async function fetchComments() {
    const response = await fetch(
        `${SUPABASE_URL}/rest/v1/user_inquiries?select=*&order=created_at.asc`,
        {
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`
            }
        }
    );

    const data = await response.json();
    const feed = document.getElementById('commentFeed');
    feed.innerHTML = '';

    const commentsMap = {};
    const topLevel = [];

    data.forEach(item => {
        commentsMap[item.id] = { ...item, replies: [] };
    });

    data.forEach(item => {
        if (item.parent_id && commentsMap[item.parent_id]) {
            commentsMap[item.parent_id].replies.push(commentsMap[item.id]);
        } else {
            topLevel.push(commentsMap[item.id]);
        }
    });

    // Render only top level + their direct replies
    topLevel.forEach(comment => {
        feed.appendChild(createCommentElement(comment));
    });
}


function createCommentElement(comment) {
    const div = document.createElement('div');
    div.className = 'comment-entry';

    const time = new Date(comment.created_at).toLocaleTimeString([], {
        hour: '2-digit', minute: '2-digit'
    });

    // Main comment HTML with profile icon
    div.innerHTML = `
        <div class="profile-icon"><i class="bi bi-person-fill"></i></div>
        <div class="comment-content">
            <span class="comment-time">${time}</span>
            <p class="comment-text">${escapeHtml(comment.message)}</p>
            <button class="reply-btn" data-id="${comment.id}">↩ Reply</button>
            <div class="replies-container" id="replies-${comment.id}"></div>
        </div>
    `;

    // Add replies inside the replies container (no profile icons)
    if (comment.replies && comment.replies.length > 0) {
        const repliesContainer = div.querySelector(`#replies-${comment.id}`);

        comment.replies.forEach(reply => {
            const replyDiv = document.createElement('div');
            replyDiv.className = 'reply-entry';

            const replyTime = new Date(reply.created_at).toLocaleTimeString([], {
                hour: '2-digit', minute: '2-digit'
            });

            replyDiv.innerHTML = `
                <div class="reply-content">
                    <div class="reply-time">${replyTime}</div>
                    <p class="reply-text">${escapeHtml(reply.message)}</p>
                </div>
            `;
            repliesContainer.appendChild(replyDiv);
        });
    }

    // Reply button functionality
    div.querySelector('.reply-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        currentReplyTo = comment.id;
        const input = document.getElementById('userInquiry');
        input.placeholder = `↳ Replying to: "${comment.message.substring(0, 40)}..."`;
        input.focus();

        // Optional: visual feedback on which comment is being replied to
        document.querySelectorAll('.comment-entry').forEach(c => {
            c.style.borderLeftColor = 'var(--neon-dim)';
        });
        div.style.borderLeftColor = 'var(--neon)';
        div.style.background = 'rgba(0, 255, 170, 0.05)';
    });

    return div;
}

// Send message
document.getElementById('sendBtn').onclick = async () => {
    const input = document.getElementById('userInquiry');
    const message = input.value.trim();
    if (!message) return;

    const btn = document.getElementById('sendBtn');
    btn.disabled = true;

    const payload = { message: message };
    if (currentReplyTo) {
        payload.parent_id = currentReplyTo;
    }

    await fetch(`${SUPABASE_URL}/rest/v1/user_inquiries`, {
        method: 'POST',
        headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        },
        body: JSON.stringify(payload)
    });

    input.value = '';
    btn.disabled = false;
    
    resetReplyMode();
    await fetchComments();
};

function resetReplyMode() {
    currentReplyTo = null;
    document.getElementById('userInquiry').placeholder = "Type inquiry...";
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
