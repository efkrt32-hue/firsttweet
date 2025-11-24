(function() {
    let keyword = new URL(window.location.href).searchParams.get("q") || "";
    keyword = decodeURIComponent(keyword).toLowerCase();

    function getYear() {
        const match = window.location.href.match(/since:(\d{4})/);
        return match ? parseInt(match[1], 10) : null;
    }

    const year = getYear();

    function log(msg) {
        console.log("[TweetBot] " + msg);
    }

    log("Bot çalıştı. Yıl: " + year);
    log("Aranan kelime: " + keyword);

    const tweets = document.querySelectorAll('[data-testid="tweetText"]');

    if (tweets.length === 0) {
        log("Tweet yok → Sonraki yıla geçiliyor...");
        goNextYear();
        return;
    }

    let earliest = null;

    tweets.forEach(t => {
        const text = t.innerText.toLowerCase();
        if (text.includes(keyword)) {
            const container = t.closest("article");
            const time = container.querySelector("time");

            if (time) {
                const date = new Date(time.getAttribute("datetime"));
                if (!earliest || date < earliest) {
                    earliest = date;
                }
            }
        }
    });

    if (!earliest) {
        log("Bu yılda kelime geçen tweet yok. → Sonraki yıl...");
        goNextYear();
        return;
    }

    alert(
        "🚀 İlk tweet bulundu!\n\n" +
        "Kelime: " + keyword + "\n" +
        "Yıl: " + year + "\n" +
        "Tarih: " + earliest.toISOString()
    );

})();
    
function goNextYear() {
    const url = window.location.href;
    const match = url.match(/since:(\d{4})/);

    if (!match) return;

    const current = parseInt(match[1], 10);
    const next = current + 1;

    const newUrl = url.replace(/since:\d{4}/, "since:" + next)
                      .replace(/until:\d{4}/, "until:" + next);

    window.location.href = newUrl + "#tweetbot";
}

