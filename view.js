(async function() {
    // 1. Point directly to your active backend proxy worker
    const PROXY_WORKER = "https://icy-morning-24cf.boxedtuffy.workers.dev";

    try {
        // 2. Fetch the raw HTML body directly from the unblocked worker address
        const response = await fetch(PROXY_WORKER);
        if (!response.ok) throw new Error("Network response failed");
        
        const htmlContent = await text();

        // 3. Clear the blank text view and inject the movie platform application
        document.open();
        document.write(htmlContent);
        document.close();

        // 4. Fix relative path errors by updating the browser base destination
        const base = document.createElement("base");
        base.href = PROXY_WORKER;
        document.head.appendChild(base);

    } catch (error) {
        // Fallback display if a connection dropout occurs
        document.body.innerHTML = `
            <div style="color:white; background:#111; font-family:sans-serif; text-align:center; padding:50px; height:100vh;">
                <h2>Incinerate+ Gateway Timeout</h2>
                <p>Could not download structural assets from proxy worker node.</p>
            </div>
        `;
    }
})();
