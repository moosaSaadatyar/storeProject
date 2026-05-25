const baseUrl = "http://localhost:4200";
const homeUrl = "http://localhost:4200";

export const environment = {
  production: false,
  application: {
    baseUrl,
    name: "Rahian",
    logoUrl: "",
  },
  oAuthConfig: {
    issuer: "http://192.168.253.90:2003/",
    redirectUri: homeUrl,
    clientId: "Rahian_App",
    responseType: "code",
    scope: "offline_access Rahian",
    requireHttps: false,
  },
  apis: {
    default: {
      url: "http://192.168.253.90:2002",
      rootNamespace: "Baharan.Rahian",
    },
  },
} as any;
