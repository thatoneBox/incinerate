(async function() {
    const PROXY_WORKER = "https://icy-morning-24cf.boxedtuffy.workers.dev/";

    try {
        const response = await fetch(PROXY_WORKER);
        if (!response.ok) throw new Error("Network response failed");
        
        // FIXED: Properly reading the text from the response variable
        const htmlContent = await response.text();

        document.open();
        document.write(htmlContent);
        document.close();

        const base = document.createElement("base");
        base.href = PROXY_WORKER;
        document.head.appendChild(base);

    } catch (error) {
        document.body.innerHTML = `
            <div style="color:white; background:#111; font-family:sans-serif; text-align:center; padding:50px; height:100vh;">
                <h2>Incinerate+ Gateway Timeout</h2>
                <p>Could not download structural assets from proxy worker node.</p>
            </div>
        `;
    }
})();
