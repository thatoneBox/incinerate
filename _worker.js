export default {
  async fetch(request, env, ctx) {
    // 1. Force the target to download directly through your active routing proxy
    const TARGET_GATEWAY = "https://icy-morning-24cf.boxedtuffy.workers.dev";
    const url = new URL(request.url);
    const target = new URL(TARGET_GATEWAY);

    // Swap parameters entirely so the browser doesn't execute localized domain queries
    url.hostname = target.hostname;
    url.protocol = target.protocol;

    const newHeaders = new Headers(request.headers);
    newHeaders.set("Host", target.hostname);
    newHeaders.set("Referer", TARGET_GATEWAY);

    // Completely drop identifying router traces
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

    try {
      // 2. Download the movie hub layout elements directly onto the edge network
      let response = await fetch(proxyRequest);
      
      const cleanResponseHeaders = new Headers(response.headers);
      cleanResponseHeaders.set("Access-Control-Allow-Origin", "*");
      
      // Prevent security layout drop exceptions
      cleanResponseHeaders.delete("X-Frame-Options");
      cleanResponseHeaders.delete("Content-Security-Policy");

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: cleanResponseHeaders
      });
    } catch (err) {
      return new Response("Edge server delivery network timeout", { status: 502 });
    }
  }
};
