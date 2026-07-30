export default {
  async fetch(request, env, ctx) {
    const targetUrl = "https://incinerate-pluss.lovable.app"; 
    const url = new URL(request.url);
    const target = new URL(targetUrl);
    
    // 1. Map the address to Lovable's server
    url.hostname = target.hostname;
    url.protocol = target.protocol;
    
    const newHeaders = new Headers(request.headers);
    
    // 2. CRITICAL: Fake the Host, Origin, and Referer so the AI Token doesn't fail
    newHeaders.set("Host", target.hostname);
    
    if (newHeaders.has("origin")) {
      newHeaders.set("origin", targetUrl);
    }
    
    if (newHeaders.has("referer")) {
      try {
        const refUrl = new URL(newHeaders.get("referer"));
        refUrl.hostname = target.hostname;
        refUrl.protocol = target.protocol;
        newHeaders.set("referer", refUrl.toString());
      } catch (e) {
        newHeaders.set("referer", targetUrl);
      }
    } else {
      newHeaders.set("referer", targetUrl);
    }
    
    // 3. Wipe out Cloudflare signatures that alert Lovable's token validation
    newHeaders.delete("cf-connecting-ip");
    newHeaders.delete("cf-ray");
    newHeaders.delete("cf-visitor");
    newHeaders.delete("x-forwarded-for");
    newHeaders.delete("x-forwarded-proto");
    
    // 4. Build and send the clean request
    const modifiedRequest = new Request(url, {
      method: request.method,
      headers: newHeaders,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : null,
      redirect: 'follow'
    });
    
    let response = await fetch(modifiedRequest);
    
    // 5. Clone and pass back the data with open CORS settings
    const modifiedResponse = new Response(response.body, response);
    modifiedResponse.headers.set("Access-Control-Allow-Origin", "*");
    
    return modifiedResponse;
  },
};
