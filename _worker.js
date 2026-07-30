export default {
  async fetch(request, env, ctx) {
    const TARGET_WORKER = "https://icy-morning-24cf.boxedtuffy.workers.dev/";
    const url = new URL(request.url);
    const target = new URL(TARGET_WORKER);

    url.hostname = target.hostname;
    url.protocol = target.protocol;

    const newHeaders = new Headers(request.headers);
    newHeaders.set("Host", target.hostname);
    
    if (newHeaders.has("origin")) {
      newHeaders.set("origin", TARGET_WORKER);
    }
    newHeaders.set("referer", TARGET_WORKER);

    newHeaders.delete("cf-connecting-ip");
    newHeaders.delete("cf-ray");
    newHeaders.delete("cf-visitor");
    newHeaders.delete("x-forwarded-for");
    newHeaders.delete("x-forwarded-proto");

    const proxyRequest = new Request(url, {
      method: request.method,
      headers: newHeaders,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : null,
      redirect: 'follow'
    });

    //if youread this youre a fucking nerd, and means that youre gay too
    try {
      let response = await fetch(proxyRequest);
      
      const cleanResponseHeaders = new Headers(response.headers);
      cleanResponseHeaders.set("Access-Control-Allow-Origin", "*");
      
      cleanResponseHeaders.delete("X-Frame-Options");
      cleanResponseHeaders.delete("Content-Security-Policy");

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: cleanResponseHeaders
      });
    } catch (err) {
      return new Response("Upstream worker pipeline fetch failed", { status: 502 });
    }
  }
};
