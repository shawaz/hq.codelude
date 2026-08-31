const authConfig = {
  providers: [
    {
      // Must be the Convex deployment's site URL — Convex Auth signs JWTs with
      // this as the issuer (see setIssuer(CONVEX_SITE_URL) in @convex-dev/auth).
      // Using SITE_URL here makes every token fail validation.
      domain: process.env.CONVEX_SITE_URL,
      applicationID: "convex",
    },
  ],
};

export default authConfig;
