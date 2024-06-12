import { H as he, a as ee, S as M, c as ge, g as we, n as xe, r as ve, b as Ee, d as fe, f as Se, t as Ce, N as Pe, p as Ie, e as be, h as Re, i as ke, j as Ae, D as De, k as _e, F as ze, l as Oe, m as $e, s as Fe, o as Ne, q as He, u as je, v as Te, w as Ue, x as Me, y as qe, z as Le, A as Ge, B as Be, C as Ve, E as Je, G as Ke, I as We, J as Xe, K as Ye, L as Qe, M as Ze, O as et, P as tt, Q as st, R as nt, T as it, U as rt, V as ot, W as m, X as at, Y as te, Z as R, _ as dt, $ as ct, a0 as lt, a1 as se, a2 as ne, a3 as ie } from "./index-DUwTVcNK.js";
const l = (e) => {
  if (e == null)
    return {};
  if (Array.isArray(e))
    return e.filter((t) => t != null).map(l);
  if (typeof e == "object") {
    const t = {};
    for (const s of Object.keys(e))
      e[s] != null && (t[s] = l(e[s]));
    return t;
  }
  return e;
}, q = (e) => {
  var t, s;
  return he.isInstance(e) ? ((t = e.headers) == null ? void 0 : t.date) ?? ((s = e.headers) == null ? void 0 : s.Date) : void 0;
}, re = (e) => new Date(Date.now() + e), ut = (e, t) => Math.abs(re(t).getTime() - e) >= 3e5, L = (e, t) => {
  const s = Date.parse(e);
  return ut(s, t) ? s - Date.now() : t;
}, S = (e, t) => {
  if (!t)
    throw new Error(`Property \`${e}\` is not resolved for AWS SDK SigV4Auth`);
  return t;
}, pt = async (e) => {
  var c, a, w;
  const t = S("context", e.context), s = S("config", e.config), n = (w = (a = (c = t.endpointV2) == null ? void 0 : c.properties) == null ? void 0 : a.authSchemes) == null ? void 0 : w[0], o = await S("signer", s.signer)(n), r = e == null ? void 0 : e.signingRegion, d = e == null ? void 0 : e.signingName;
  return {
    config: s,
    signer: o,
    signingRegion: r,
    signingName: d
  };
};
class mt {
  async sign(t, s, n) {
    if (!ee.isInstance(t))
      throw new Error("The request is not an instance of `HttpRequest` and cannot be signed");
    const { config: i, signer: o, signingRegion: r, signingName: d } = await pt(n);
    return await o.sign(t, {
      signingDate: re(i.systemClockOffset),
      signingRegion: r,
      signingService: d
    });
  }
  errorHandler(t) {
    return (s) => {
      const n = s.ServerTime ?? q(s.$response);
      if (n) {
        const i = S("config", t.config), o = i.systemClockOffset;
        i.systemClockOffset = L(n, i.systemClockOffset), i.systemClockOffset !== o && s.$metadata && (s.$metadata.clockSkewCorrected = !0);
      }
      throw s;
    };
  }
  successHandler(t, s) {
    const n = q(t);
    if (n) {
      const i = S("config", s.config);
      i.systemClockOffset = L(n, i.systemClockOffset);
    }
  }
}
class yt {
  constructor(t) {
    this.authSchemes = /* @__PURE__ */ new Map();
    for (const [s, n] of Object.entries(t))
      n !== void 0 && this.authSchemes.set(s, n);
  }
  getIdentityProvider(t) {
    return this.authSchemes.get(t);
  }
}
class ht {
  async sign(t, s, n) {
    return t;
  }
}
const gt = (e) => (t) => oe(t) && t.expiration.getTime() - Date.now() < e, wt = 3e5, xt = gt(wt), oe = (e) => e.expiration !== void 0, vt = (e, t, s) => {
  if (e === void 0)
    return;
  const n = typeof e != "function" ? async () => Promise.resolve(e) : e;
  let i, o, r, d = !1;
  const c = async (a) => {
    o || (o = n(a));
    try {
      i = await o, r = !0, d = !1;
    } finally {
      o = void 0;
    }
    return i;
  };
  return t === void 0 ? async (a) => ((!r || a != null && a.forceRefresh) && (i = await c(a)), i) : async (a) => ((!r || a != null && a.forceRefresh) && (i = await c(a)), d ? i : s(i) ? (t(i) && await c(a), i) : (d = !0, i));
}, P = (e) => {
  if (typeof e == "function")
    return e;
  const t = Promise.resolve(e);
  return () => t;
}, Et = (e) => {
  let t;
  e.credentials && (t = vt(e.credentials, xt, oe)), t || (e.credentialDefaultProvider ? t = P(e.credentialDefaultProvider(Object.assign({}, e, {
    parentClientConfig: e
  }))) : t = async () => {
    throw new Error("`credentials` is missing");
  });
  const { signingEscapePath: s = !0, systemClockOffset: n = e.systemClockOffset || 0, sha256: i } = e;
  let o;
  return e.signer ? o = P(e.signer) : e.regionInfoProvider ? o = () => P(e.region)().then(async (r) => [
    await e.regionInfoProvider(r, {
      useFipsEndpoint: await e.useFipsEndpoint(),
      useDualstackEndpoint: await e.useDualstackEndpoint()
    }) || {},
    r
  ]).then(([r, d]) => {
    const { signingRegion: c, signingService: a } = r;
    e.signingRegion = e.signingRegion || c || d, e.signingName = e.signingName || a || e.serviceId;
    const w = {
      ...e,
      credentials: t,
      region: e.signingRegion,
      service: e.signingName,
      sha256: i,
      uriEscapePath: s
    }, ye = e.signerConstructor || M;
    return new ye(w);
  }) : o = async (r) => {
    r = Object.assign({}, {
      name: "sigv4",
      signingName: e.signingName || e.defaultSigningName,
      signingRegion: await P(e.region)(),
      properties: {}
    }, r);
    const d = r.signingRegion, c = r.signingName;
    e.signingRegion = e.signingRegion || d, e.signingName = e.signingName || c || e.serviceId;
    const a = {
      ...e,
      credentials: t,
      region: e.signingRegion,
      service: e.signingName,
      sha256: i,
      uriEscapePath: s
    }, w = e.signerConstructor || M;
    return new w(a);
  }, {
    ...e,
    systemClockOffset: n,
    signingEscapePath: s,
    credentials: t,
    signer: o
  };
}, k = (e, t) => ge(e, t).then((s) => {
  if (s.length)
    try {
      return JSON.parse(s);
    } catch (n) {
      throw (n == null ? void 0 : n.name) === "SyntaxError" && Object.defineProperty(n, "$responseBodyText", {
        value: s
      }), n;
    }
  return {};
}), ft = async (e, t) => {
  const s = await k(e, t);
  return s.message = s.message ?? s.Message, s;
}, St = (e, t) => {
  const s = (o, r) => Object.keys(o).find((d) => d.toLowerCase() === r.toLowerCase()), n = (o) => {
    let r = o;
    return typeof r == "number" && (r = r.toString()), r.indexOf(",") >= 0 && (r = r.split(",")[0]), r.indexOf(":") >= 0 && (r = r.split(":")[0]), r.indexOf("#") >= 0 && (r = r.split("#")[1]), r;
  }, i = s(e.headers, "x-amzn-errortype");
  if (i !== void 0)
    return n(e.headers[i]);
  if (t.code !== void 0)
    return n(t.code);
  if (t.__type !== void 0)
    return n(t.__type);
}, Ct = async (e, t, s) => ({
  operation: we(t).operation,
  region: await xe(e.region)() || (() => {
    throw new Error("expected `region` to be configured for `aws.auth#sigv4`");
  })()
});
function Pt(e) {
  return {
    schemeId: "aws.auth#sigv4",
    signingProperties: {
      name: "cognito-identity",
      region: e.region
    },
    propertiesExtractor: (t, s) => ({
      signingProperties: {
        config: t,
        context: s
      }
    })
  };
}
function I(e) {
  return {
    schemeId: "smithy.api#noAuth"
  };
}
const It = (e) => {
  const t = [];
  switch (e.operation) {
    case "GetCredentialsForIdentity": {
      t.push(I());
      break;
    }
    case "GetId": {
      t.push(I());
      break;
    }
    case "GetOpenIdToken": {
      t.push(I());
      break;
    }
    case "UnlinkIdentity": {
      t.push(I());
      break;
    }
    default:
      t.push(Pt(e));
  }
  return t;
}, bt = (e) => ({
  ...Et(e)
}), Rt = (e) => ({
  ...e,
  useDualstackEndpoint: e.useDualstackEndpoint ?? !1,
  useFipsEndpoint: e.useFipsEndpoint ?? !1,
  defaultSigningName: "cognito-identity"
}), ae = {
  UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
  Endpoint: { type: "builtInParams", name: "endpoint" },
  Region: { type: "builtInParams", name: "region" },
  UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" }
}, kt = "@aws-sdk/client-cognito-identity", At = "AWS SDK for JavaScript Cognito Identity Client for Node.js, Browser and React Native", Dt = "3.556.0", _t = {
  build: "concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
  "build:cjs": "node ../../scripts/compilation/inline client-cognito-identity",
  "build:es": "tsc -p tsconfig.es.json",
  "build:include:deps": "lerna run --scope $npm_package_name --include-dependencies build",
  "build:types": "tsc -p tsconfig.types.json",
  "build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
  clean: "rimraf ./dist-* && rimraf *.tsbuildinfo",
  "extract:docs": "api-extractor run --local",
  "generate:client": "node ../../scripts/generate-clients/single-service --solo cognito-identity",
  "test:e2e": "ts-mocha test/**/*.ispec.ts && karma start karma.conf.js"
}, zt = "./dist-cjs/index.js", Ot = "./dist-types/index.d.ts", $t = "./dist-es/index.js", Ft = !1, Nt = {
  "@aws-crypto/sha256-browser": "3.0.0",
  "@aws-crypto/sha256-js": "3.0.0",
  "@aws-sdk/client-sts": "3.556.0",
  "@aws-sdk/core": "3.556.0",
  "@aws-sdk/credential-provider-node": "3.556.0",
  "@aws-sdk/middleware-host-header": "3.535.0",
  "@aws-sdk/middleware-logger": "3.535.0",
  "@aws-sdk/middleware-recursion-detection": "3.535.0",
  "@aws-sdk/middleware-user-agent": "3.540.0",
  "@aws-sdk/region-config-resolver": "3.535.0",
  "@aws-sdk/types": "3.535.0",
  "@aws-sdk/util-endpoints": "3.540.0",
  "@aws-sdk/util-user-agent-browser": "3.535.0",
  "@aws-sdk/util-user-agent-node": "3.535.0",
  "@smithy/config-resolver": "^2.2.0",
  "@smithy/core": "^1.4.2",
  "@smithy/fetch-http-handler": "^2.5.0",
  "@smithy/hash-node": "^2.2.0",
  "@smithy/invalid-dependency": "^2.2.0",
  "@smithy/middleware-content-length": "^2.2.0",
  "@smithy/middleware-endpoint": "^2.5.1",
  "@smithy/middleware-retry": "^2.3.1",
  "@smithy/middleware-serde": "^2.3.0",
  "@smithy/middleware-stack": "^2.2.0",
  "@smithy/node-config-provider": "^2.3.0",
  "@smithy/node-http-handler": "^2.5.0",
  "@smithy/protocol-http": "^3.3.0",
  "@smithy/smithy-client": "^2.5.1",
  "@smithy/types": "^2.12.0",
  "@smithy/url-parser": "^2.2.0",
  "@smithy/util-base64": "^2.3.0",
  "@smithy/util-body-length-browser": "^2.2.0",
  "@smithy/util-body-length-node": "^2.3.0",
  "@smithy/util-defaults-mode-browser": "^2.2.1",
  "@smithy/util-defaults-mode-node": "^2.3.1",
  "@smithy/util-endpoints": "^1.2.0",
  "@smithy/util-middleware": "^2.2.0",
  "@smithy/util-retry": "^2.2.0",
  "@smithy/util-utf8": "^2.3.0",
  tslib: "^2.6.2"
}, Ht = {
  "@aws-sdk/client-iam": "3.556.0",
  "@smithy/service-client-documentation-generator": "^2.2.0",
  "@tsconfig/node14": "1.0.3",
  "@types/chai": "^4.2.11",
  "@types/mocha": "^8.0.4",
  "@types/node": "^14.14.31",
  concurrently: "7.0.0",
  "downlevel-dts": "0.10.1",
  rimraf: "3.0.2",
  typescript: "~4.9.5"
}, jt = {
  node: ">=14.0.0"
}, Tt = {
  "<4.0": {
    "dist-types/*": [
      "dist-types/ts3.4/*"
    ]
  }
}, Ut = [
  "dist-*/**"
], Mt = {
  name: "AWS SDK for JavaScript Team",
  url: "https://aws.amazon.com/javascript/"
}, qt = "Apache-2.0", Lt = {
  "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.browser"
}, Gt = "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-cognito-identity", Bt = {
  type: "git",
  url: "https://github.com/aws/aws-sdk-js-v3.git",
  directory: "clients/client-cognito-identity"
}, Vt = {
  name: kt,
  description: At,
  version: Dt,
  scripts: _t,
  main: zt,
  types: Ot,
  module: $t,
  sideEffects: Ft,
  dependencies: Nt,
  devDependencies: Ht,
  engines: jt,
  typesVersions: Tt,
  files: Ut,
  author: Mt,
  license: qt,
  browser: Lt,
  "react-native": {
    "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.native"
  },
  homepage: Gt,
  repository: Bt
}, de = "required", h = "fn", g = "argv", E = "ref", G = !0, B = "isSet", C = "booleanEquals", v = "error", f = "endpoint", x = "tree", A = "PartitionResult", V = { [de]: !1, type: "String" }, J = { [de]: !0, default: !1, type: "Boolean" }, K = { [E]: "Endpoint" }, ce = { [h]: C, [g]: [{ [E]: "UseFIPS" }, !0] }, le = { [h]: C, [g]: [{ [E]: "UseDualStack" }, !0] }, y = {}, W = { [h]: "getAttr", [g]: [{ [E]: A }, "supportsFIPS"] }, X = { [h]: C, [g]: [!0, { [h]: "getAttr", [g]: [{ [E]: A }, "supportsDualStack"] }] }, Y = [ce], Q = [le], Z = [{ [E]: "Region" }], Jt = { version: "1.0", parameters: { Region: V, UseDualStack: J, UseFIPS: J, Endpoint: V }, rules: [{ conditions: [{ [h]: B, [g]: [K] }], rules: [{ conditions: Y, error: "Invalid Configuration: FIPS and custom endpoint are not supported", type: v }, { conditions: Q, error: "Invalid Configuration: Dualstack and custom endpoint are not supported", type: v }, { endpoint: { url: K, properties: y, headers: y }, type: f }], type: x }, { conditions: [{ [h]: B, [g]: Z }], rules: [{ conditions: [{ [h]: "aws.partition", [g]: Z, assign: A }], rules: [{ conditions: [ce, le], rules: [{ conditions: [{ [h]: C, [g]: [G, W] }, X], rules: [{ endpoint: { url: "https://cognito-identity-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: y, headers: y }, type: f }], type: x }, { error: "FIPS and DualStack are enabled, but this partition does not support one or both", type: v }], type: x }, { conditions: Y, rules: [{ conditions: [{ [h]: C, [g]: [W, G] }], rules: [{ endpoint: { url: "https://cognito-identity-fips.{Region}.{PartitionResult#dnsSuffix}", properties: y, headers: y }, type: f }], type: x }, { error: "FIPS is enabled but this partition does not support FIPS", type: v }], type: x }, { conditions: Q, rules: [{ conditions: [X], rules: [{ endpoint: { url: "https://cognito-identity.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: y, headers: y }, type: f }], type: x }, { error: "DualStack is enabled but this partition does not support DualStack", type: v }], type: x }, { endpoint: { url: "https://cognito-identity.{Region}.{PartitionResult#dnsSuffix}", properties: y, headers: y }, type: f }], type: x }], type: x }, { error: "Invalid Configuration: Missing Region", type: v }] }, Kt = Jt, Wt = (e, t = {}) => ve(Kt, {
  endpointParams: e,
  logger: t.logger
});
Ee.aws = fe;
const Xt = (e) => ({
  apiVersion: "2014-06-30",
  base64Decoder: (e == null ? void 0 : e.base64Decoder) ?? Se,
  base64Encoder: (e == null ? void 0 : e.base64Encoder) ?? Ce,
  disableHostPrefix: (e == null ? void 0 : e.disableHostPrefix) ?? !1,
  endpointProvider: (e == null ? void 0 : e.endpointProvider) ?? Wt,
  extensions: (e == null ? void 0 : e.extensions) ?? [],
  httpAuthSchemeProvider: (e == null ? void 0 : e.httpAuthSchemeProvider) ?? It,
  httpAuthSchemes: (e == null ? void 0 : e.httpAuthSchemes) ?? [
    {
      schemeId: "aws.auth#sigv4",
      identityProvider: (t) => t.getIdentityProvider("aws.auth#sigv4"),
      signer: new mt()
    },
    {
      schemeId: "smithy.api#noAuth",
      identityProvider: (t) => t.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
      signer: new ht()
    }
  ],
  logger: (e == null ? void 0 : e.logger) ?? new Pe(),
  serviceId: (e == null ? void 0 : e.serviceId) ?? "Cognito Identity",
  urlParser: (e == null ? void 0 : e.urlParser) ?? Ie,
  utf8Decoder: (e == null ? void 0 : e.utf8Decoder) ?? be,
  utf8Encoder: (e == null ? void 0 : e.utf8Encoder) ?? Re
}), Yt = (e) => {
  const t = je(e), s = () => t().then(Te), n = Xt(e);
  return {
    ...n,
    ...e,
    runtime: "browser",
    defaultsMode: t,
    bodyLengthChecker: (e == null ? void 0 : e.bodyLengthChecker) ?? ke,
    credentialDefaultProvider: (e == null ? void 0 : e.credentialDefaultProvider) ?? ((i) => () => Promise.reject(new Error("Credential is missing"))),
    defaultUserAgentProvider: (e == null ? void 0 : e.defaultUserAgentProvider) ?? Ae({ serviceId: n.serviceId, clientVersion: Vt.version }),
    maxAttempts: (e == null ? void 0 : e.maxAttempts) ?? De,
    region: (e == null ? void 0 : e.region) ?? _e("Region is missing"),
    requestHandler: ze.create((e == null ? void 0 : e.requestHandler) ?? s),
    retryMode: (e == null ? void 0 : e.retryMode) ?? (async () => (await s()).retryMode || Oe),
    sha256: (e == null ? void 0 : e.sha256) ?? $e.Sha256,
    streamCollector: (e == null ? void 0 : e.streamCollector) ?? Fe,
    useDualstackEndpoint: (e == null ? void 0 : e.useDualstackEndpoint) ?? (() => Promise.resolve(Ne)),
    useFipsEndpoint: (e == null ? void 0 : e.useFipsEndpoint) ?? (() => Promise.resolve(He))
  };
}, Qt = (e) => {
  const t = e.httpAuthSchemes;
  let s = e.httpAuthSchemeProvider, n = e.credentials;
  return {
    setHttpAuthScheme(i) {
      const o = t.findIndex((r) => r.schemeId === i.schemeId);
      o === -1 ? t.push(i) : t.splice(o, 1, i);
    },
    httpAuthSchemes() {
      return t;
    },
    setHttpAuthSchemeProvider(i) {
      s = i;
    },
    httpAuthSchemeProvider() {
      return s;
    },
    setCredentials(i) {
      n = i;
    },
    credentials() {
      return n;
    }
  };
}, Zt = (e) => ({
  httpAuthSchemes: e.httpAuthSchemes(),
  httpAuthSchemeProvider: e.httpAuthSchemeProvider(),
  credentials: e.credentials()
}), b = (e) => e, es = (e, t) => {
  const s = {
    ...b(Be(e)),
    ...b(Ue(e)),
    ...b(Me(e)),
    ...b(Qt(e))
  };
  return t.forEach((n) => n.configure(s)), {
    ...e,
    ...qe(s),
    ...Le(s),
    ...Ge(s),
    ...Zt(s)
  };
};
class Es extends Ve {
  constructor(...[t]) {
    const s = Yt(t || {}), n = Rt(s), i = Je(n), o = Ke(i), r = We(o), d = rt(r), c = Xe(d), a = bt(c), w = es(a, (t == null ? void 0 : t.extensions) || []);
    super(w), this.config = w, this.middlewareStack.use(Ye(this.config)), this.middlewareStack.use(Qe(this.config)), this.middlewareStack.use(Ze(this.config)), this.middlewareStack.use(et(this.config)), this.middlewareStack.use(tt(this.config)), this.middlewareStack.use(st(this.config)), this.middlewareStack.use(nt(this.config, {
      httpAuthSchemeParametersProvider: this.getDefaultHttpAuthSchemeParametersProvider(),
      identityProviderConfigProvider: this.getIdentityProviderConfigProvider()
    })), this.middlewareStack.use(it(this.config));
  }
  destroy() {
    super.destroy();
  }
  getDefaultHttpAuthSchemeParametersProvider() {
    return Ct;
  }
  getIdentityProviderConfigProvider() {
    return async (t) => new yt({
      "aws.auth#sigv4": t.credentials
    });
  }
}
class u extends ot {
  constructor(t) {
    super(t), Object.setPrototypeOf(this, u.prototype);
  }
}
class D extends u {
  constructor(t) {
    super({
      name: "InternalErrorException",
      $fault: "server",
      ...t
    }), this.name = "InternalErrorException", this.$fault = "server", Object.setPrototypeOf(this, D.prototype);
  }
}
class _ extends u {
  constructor(t) {
    super({
      name: "InvalidParameterException",
      $fault: "client",
      ...t
    }), this.name = "InvalidParameterException", this.$fault = "client", Object.setPrototypeOf(this, _.prototype);
  }
}
class z extends u {
  constructor(t) {
    super({
      name: "LimitExceededException",
      $fault: "client",
      ...t
    }), this.name = "LimitExceededException", this.$fault = "client", Object.setPrototypeOf(this, z.prototype);
  }
}
class O extends u {
  constructor(t) {
    super({
      name: "NotAuthorizedException",
      $fault: "client",
      ...t
    }), this.name = "NotAuthorizedException", this.$fault = "client", Object.setPrototypeOf(this, O.prototype);
  }
}
class $ extends u {
  constructor(t) {
    super({
      name: "ResourceConflictException",
      $fault: "client",
      ...t
    }), this.name = "ResourceConflictException", this.$fault = "client", Object.setPrototypeOf(this, $.prototype);
  }
}
class F extends u {
  constructor(t) {
    super({
      name: "TooManyRequestsException",
      $fault: "client",
      ...t
    }), this.name = "TooManyRequestsException", this.$fault = "client", Object.setPrototypeOf(this, F.prototype);
  }
}
class N extends u {
  constructor(t) {
    super({
      name: "ResourceNotFoundException",
      $fault: "client",
      ...t
    }), this.name = "ResourceNotFoundException", this.$fault = "client", Object.setPrototypeOf(this, N.prototype);
  }
}
class H extends u {
  constructor(t) {
    super({
      name: "ExternalServiceException",
      $fault: "client",
      ...t
    }), this.name = "ExternalServiceException", this.$fault = "client", Object.setPrototypeOf(this, H.prototype);
  }
}
class j extends u {
  constructor(t) {
    super({
      name: "InvalidIdentityPoolConfigurationException",
      $fault: "client",
      ...t
    }), this.name = "InvalidIdentityPoolConfigurationException", this.$fault = "client", Object.setPrototypeOf(this, j.prototype);
  }
}
class T extends u {
  constructor(t) {
    super({
      name: "DeveloperUserAlreadyRegisteredException",
      $fault: "client",
      ...t
    }), this.name = "DeveloperUserAlreadyRegisteredException", this.$fault = "client", Object.setPrototypeOf(this, T.prototype);
  }
}
class U extends u {
  constructor(t) {
    super({
      name: "ConcurrentModificationException",
      $fault: "client",
      ...t
    }), this.name = "ConcurrentModificationException", this.$fault = "client", Object.setPrototypeOf(this, U.prototype);
  }
}
const ts = async (e, t) => {
  const s = me("GetCredentialsForIdentity");
  let n;
  return n = JSON.stringify(l(e)), pe(t, s, "/", void 0, n);
}, ss = async (e, t) => {
  const s = me("GetId");
  let n;
  return n = JSON.stringify(l(e)), pe(t, s, "/", void 0, n);
}, ns = async (e, t) => {
  if (e.statusCode >= 300)
    return ue(e, t);
  const s = await k(e.body, t);
  let n = {};
  return n = ws(s), {
    $metadata: p(e),
    ...n
  };
}, is = async (e, t) => {
  if (e.statusCode >= 300)
    return ue(e, t);
  const s = await k(e.body, t);
  let n = {};
  return n = l(s), {
    $metadata: p(e),
    ...n
  };
}, ue = async (e, t) => {
  const s = {
    ...e,
    body: await ft(e.body, t)
  }, n = St(e, s.body);
  switch (n) {
    case "InternalErrorException":
    case "com.amazonaws.cognitoidentity#InternalErrorException":
      throw await ds(s);
    case "InvalidParameterException":
    case "com.amazonaws.cognitoidentity#InvalidParameterException":
      throw await ls(s);
    case "LimitExceededException":
    case "com.amazonaws.cognitoidentity#LimitExceededException":
      throw await us(s);
    case "NotAuthorizedException":
    case "com.amazonaws.cognitoidentity#NotAuthorizedException":
      throw await ps(s);
    case "ResourceConflictException":
    case "com.amazonaws.cognitoidentity#ResourceConflictException":
      throw await ms(s);
    case "TooManyRequestsException":
    case "com.amazonaws.cognitoidentity#TooManyRequestsException":
      throw await hs(s);
    case "ResourceNotFoundException":
    case "com.amazonaws.cognitoidentity#ResourceNotFoundException":
      throw await ys(s);
    case "ExternalServiceException":
    case "com.amazonaws.cognitoidentity#ExternalServiceException":
      throw await as(s);
    case "InvalidIdentityPoolConfigurationException":
    case "com.amazonaws.cognitoidentity#InvalidIdentityPoolConfigurationException":
      throw await cs(s);
    case "DeveloperUserAlreadyRegisteredException":
    case "com.amazonaws.cognitoidentity#DeveloperUserAlreadyRegisteredException":
      throw await os(s);
    case "ConcurrentModificationException":
    case "com.amazonaws.cognitoidentity#ConcurrentModificationException":
      throw await rs(s);
    default:
      const i = s.body;
      return xs({
        output: e,
        parsedBody: i,
        errorCode: n
      });
  }
}, rs = async (e, t) => {
  const s = e.body, n = l(s), i = new U({
    $metadata: p(e),
    ...n
  });
  return m(i, s);
}, os = async (e, t) => {
  const s = e.body, n = l(s), i = new T({
    $metadata: p(e),
    ...n
  });
  return m(i, s);
}, as = async (e, t) => {
  const s = e.body, n = l(s), i = new H({
    $metadata: p(e),
    ...n
  });
  return m(i, s);
}, ds = async (e, t) => {
  const s = e.body, n = l(s), i = new D({
    $metadata: p(e),
    ...n
  });
  return m(i, s);
}, cs = async (e, t) => {
  const s = e.body, n = l(s), i = new j({
    $metadata: p(e),
    ...n
  });
  return m(i, s);
}, ls = async (e, t) => {
  const s = e.body, n = l(s), i = new _({
    $metadata: p(e),
    ...n
  });
  return m(i, s);
}, us = async (e, t) => {
  const s = e.body, n = l(s), i = new z({
    $metadata: p(e),
    ...n
  });
  return m(i, s);
}, ps = async (e, t) => {
  const s = e.body, n = l(s), i = new O({
    $metadata: p(e),
    ...n
  });
  return m(i, s);
}, ms = async (e, t) => {
  const s = e.body, n = l(s), i = new $({
    $metadata: p(e),
    ...n
  });
  return m(i, s);
}, ys = async (e, t) => {
  const s = e.body, n = l(s), i = new N({
    $metadata: p(e),
    ...n
  });
  return m(i, s);
}, hs = async (e, t) => {
  const s = e.body, n = l(s), i = new F({
    $metadata: p(e),
    ...n
  });
  return m(i, s);
}, gs = (e, t) => te(e, {
  AccessKeyId: R,
  Expiration: (s) => dt(ct(lt(s))),
  SecretKey: R,
  SessionToken: R
}), ws = (e, t) => te(e, {
  Credentials: (s) => gs(s),
  IdentityId: R
}), p = (e) => ({
  httpStatusCode: e.statusCode,
  requestId: e.headers["x-amzn-requestid"] ?? e.headers["x-amzn-request-id"] ?? e.headers["x-amz-request-id"],
  extendedRequestId: e.headers["x-amz-id-2"],
  cfId: e.headers["x-amz-cf-id"]
}), xs = at(u), pe = async (e, t, s, n, i) => {
  const { hostname: o, protocol: r = "https", port: d, path: c } = await e.endpoint(), a = {
    protocol: r,
    hostname: o,
    port: d,
    method: "POST",
    path: c.endsWith("/") ? c.slice(0, -1) + s : c + s,
    headers: t
  };
  return n !== void 0 && (a.hostname = n), i !== void 0 && (a.body = i), new ee(a);
};
function me(e) {
  return {
    "content-type": "application/x-amz-json-1.1",
    "x-amz-target": `AWSCognitoIdentityService.${e}`
  };
}
class fs extends se.classBuilder().ep({
  ...ae
}).m(function(t, s, n, i) {
  return [
    ne(n, this.serialize, this.deserialize),
    ie(n, t.getEndpointParameterInstructions())
  ];
}).s("AWSCognitoIdentityService", "GetCredentialsForIdentity", {}).n("CognitoIdentityClient", "GetCredentialsForIdentityCommand").f(void 0, void 0).ser(ts).de(ns).build() {
}
class Ss extends se.classBuilder().ep({
  ...ae
}).m(function(t, s, n, i) {
  return [
    ne(n, this.serialize, this.deserialize),
    ie(n, t.getEndpointParameterInstructions())
  ];
}).s("AWSCognitoIdentityService", "GetId", {}).n("CognitoIdentityClient", "GetIdCommand").f(void 0, void 0).ser(ss).de(is).build() {
}
export {
  Es as CognitoIdentityClient,
  fs as GetCredentialsForIdentityCommand,
  Ss as GetIdCommand
};
