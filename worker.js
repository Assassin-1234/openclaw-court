export default {
  async fetch(request) {
    const incomingUrl = new URL(request.url);

    const targetUrl = new URL(
      `/functions/v1/cases-api${incomingUrl.pathname === "/" ? "" : incomingUrl.pathname}${incomingUrl.search}`,
      "https://yatlfyfkxqysozqsmcji.supabase.co"
    );

    const proxiedRequest = new Request(targetUrl.toString(), {
      method: request.method,
      headers: request.headers,
      body:
        request.method === "GET" || request.method === "HEAD"
          ? null
          : request.body,
    });

    return fetch(proxiedRequest);
  },
};
