import { httpRouter } from "convex/server";
import { auth } from "./auth";
import { service as supportService } from "./supportHttp";

const http = httpRouter();

auth.addHttpRoutes(http);
http.route({ path: "/api/support/v1", method: "POST", handler: supportService });

export default http;
