/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as access from "../access.js";
import type * as aichat from "../aichat.js";
import type * as applications from "../applications.js";
import type * as auth from "../auth.js";
import type * as contacts from "../contacts.js";
import type * as http from "../http.js";
import type * as migrations from "../migrations.js";
import type * as offices from "../offices.js";
import type * as organizations from "../organizations.js";
import type * as pipeline from "../pipeline.js";
import type * as planDocs from "../planDocs.js";
import type * as positions from "../positions.js";
import type * as rename from "../rename.js";
import type * as renameScope from "../renameScope.js";
import type * as scopes from "../scopes.js";
import type * as tasks from "../tasks.js";
import type * as team from "../team.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  access: typeof access;
  aichat: typeof aichat;
  applications: typeof applications;
  auth: typeof auth;
  contacts: typeof contacts;
  http: typeof http;
  migrations: typeof migrations;
  offices: typeof offices;
  organizations: typeof organizations;
  pipeline: typeof pipeline;
  planDocs: typeof planDocs;
  positions: typeof positions;
  rename: typeof rename;
  renameScope: typeof renameScope;
  scopes: typeof scopes;
  tasks: typeof tasks;
  team: typeof team;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
