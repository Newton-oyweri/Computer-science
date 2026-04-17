
    const SUPABASE_URL = "https://syrngdhiefxvxkloxyjc.supabase.co";
    const SUPABASE_KEY = "sb_publishable_Mt2LZbiyEUaezzJzhuHW2Q_98MmnxgU";

    function toggleInquiry() {
        const overlay = document.getElementById('inquiryOverlay');
        const btn = document.getElementById('floatingBtn');
        overlay.classList.toggle('open');
        btn.classList.toggle('hidden');
        if(overlay.classList.contains('open')) fetchComments();
    }

    // Fetch comments from Supabase
    async function fetchComments() {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/user_inquiries?select=*&order=created_at.desc`, {
            headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
        });
        const data = await response.json();
        const feed = document.getElementById('commentFeed');
        feed.innerHTML = ''; 

        data.forEach(item => {
            const time = new Date(item.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            feed.innerHTML += `
                <div class="comment-entry">
                    <div class="profile-icon"><i class="bi bi-person-fill"></i></div>
                    <div class="comment-content">
                        <span class="comment-time">${time}</span>
                        <p class="comment-text">${item.message}</p>
                    </div>
                </div>
            `;
        });
    }

    // Post comment to Supabase
    document.getElementById('sendBtn').onclick = async () => {
        const input = document.getElementById('userInquiry');
        const msg = input.value.trim();
        if (!msg) return;

        const btn = document.getElementById('sendBtn');
        btn.disabled = true;

        await fetch(`${SUPABASE_URL}/rest/v1/user_inquiries`, {
            method: 'POST',
            headers: { 
                "apikey": SUPABASE_KEY, 
                "Authorization": `Bearer ${SUPABASE_KEY}`,
                "Content-Type": "application/json",
                "Prefer": "return=representation"
            },
            body: JSON.stringify({ message: msg })
        });

        input.value = '';
        btn.disabled = false;
        fetchComments(); // Refresh list
    };

