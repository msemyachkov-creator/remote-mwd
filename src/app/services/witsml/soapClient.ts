// ─── WITSML 1.4.1.1 SOAP Client ───────────────────────────────────────────────
//
// Implements WMLS_AddToStore and WMLS_UpdateInStore over HTTP/SOAP.
//
// CORS note: WITSML servers rarely emit CORS headers. To work from a browser,
// set `proxyUrl` in WitsmlServerConfig — all requests will be sent to
//   `${proxyUrl}/${encodeURIComponent(serverUrl)}`
// A simple express proxy (1 file) is sufficient; see docs/witsml-proxy.md.
// ─────────────────────────────────────────────────────────────────────────────

import type { WitsmlServerConfig } from "./types";

type WmlsAction = "WMLS_AddToStore" | "WMLS_UpdateInStore";
type WitsmlObjectType =
  | "trajectory"
  | "log"
  | "well"
  | "wellbore";

function buildSoapEnvelope(action: WmlsAction, objectType: WitsmlObjectType, xml: string): string {
  const soapAction =
    action === "WMLS_AddToStore"
      ? "http://www.witsml.org/action/120/Store.WMLS_AddToStore"
      : "http://www.witsml.org/action/120/Store.WMLS_UpdateInStore";

  void soapAction; // used in SOAPAction header, not in body

  return `<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope
  xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:xsi="http://www.w3.org/1999/XMLSchema-instance"
  xmlns:xsd="http://www.w3.org/1999/XMLSchema">
  <SOAP-ENV:Body>
    <${action} xmlns="http://www.witsml.org/message/120">
      <WMLtypeIn>${objectType}</WMLtypeIn>
      <XMLin><![CDATA[${xml}]]></XMLin>
      <OptionsIn>dataVersion=1.4.1.1</OptionsIn>
      <CapabilitiesIn></CapabilitiesIn>
    </${action}>
  </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`;
}

function soapActionHeader(action: WmlsAction): string {
  return action === "WMLS_AddToStore"
    ? "http://www.witsml.org/action/120/Store.WMLS_AddToStore"
    : "http://www.witsml.org/action/120/Store.WMLS_UpdateInStore";
}

function resolveEndpoint(cfg: WitsmlServerConfig): string {
  return cfg.proxyUrl
    ? `${cfg.proxyUrl.replace(/\/$/, "")}/${encodeURIComponent(cfg.url)}`
    : cfg.url;
}

function basicAuth(user: string, pass: string): string {
  return "Basic " + btoa(`${user}:${pass}`);
}

export interface SoapResult {
  ok: boolean;
  resultCode?: number;   // WITSML result code (1 = success)
  errorMessage?: string;
  rawBody?: string;
}

/** Parse WMLS result code from SOAP response */
function parseResult(body: string): SoapResult {
  const codeMatch = body.match(/<Result>(-?\d+)<\/Result>/);
  const msgMatch  = body.match(/<SuppMsgOut>([\s\S]*?)<\/SuppMsgOut>/);
  const code      = codeMatch ? parseInt(codeMatch[1], 10) : null;
  const msg       = msgMatch  ? msgMatch[1].trim() : undefined;

  if (code === null) {
    // Check for SOAP fault
    const faultMatch = body.match(/<faultstring>([\s\S]*?)<\/faultstring>/);
    return { ok: false, errorMessage: faultMatch ? faultMatch[1].trim() : "Unknown SOAP error", rawBody: body };
  }

  if (code >= 1) {
    return { ok: true, resultCode: code, rawBody: body };
  }

  return { ok: false, resultCode: code, errorMessage: msg ?? `WITSML error code ${code}`, rawBody: body };
}

export class WitsmlSoapClient {
  constructor(private cfg: WitsmlServerConfig) {}

  private async call(
    action: WmlsAction,
    objectType: WitsmlObjectType,
    xml: string,
    signal?: AbortSignal
  ): Promise<SoapResult> {
    const endpoint = resolveEndpoint(this.cfg);
    const envelope = buildSoapEnvelope(action, objectType, xml);

    let response: Response;
    try {
      response = await fetch(endpoint, {
        method:  "POST",
        headers: {
          "Content-Type": "text/xml; charset=utf-8",
          "SOAPAction":   `"${soapActionHeader(action)}"`,
          "Authorization": basicAuth(this.cfg.username, this.cfg.password),
        },
        body: envelope,
        signal,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return { ok: false, errorMessage: `Network error: ${msg}` };
    }

    const body = await response.text();

    if (!response.ok) {
      return { ok: false, errorMessage: `HTTP ${response.status}: ${response.statusText}`, rawBody: body };
    }

    return parseResult(body);
  }

  /** Add a new WITSML object (fails if already exists) */
  async add(objectType: WitsmlObjectType, xml: string, signal?: AbortSignal): Promise<SoapResult> {
    return this.call("WMLS_AddToStore", objectType, xml, signal);
  }

  /** Update an existing WITSML object (upsert-like; appends log rows / stations) */
  async update(objectType: WitsmlObjectType, xml: string, signal?: AbortSignal): Promise<SoapResult> {
    return this.call("WMLS_UpdateInStore", objectType, xml, signal);
  }

  /**
   * Smart upsert: try UpdateInStore first; if the object does not exist
   * (result code -486), fall back to AddToStore.
   */
  async upsert(objectType: WitsmlObjectType, xml: string, signal?: AbortSignal): Promise<SoapResult> {
    const update = await this.update(objectType, xml, signal);
    if (update.ok) return update;
    // -486 = "object not found" in WITSML
    if (update.resultCode === -486 || update.resultCode === -401) {
      return this.add(objectType, xml, signal);
    }
    return update;
  }

  /** Ping: try a minimal GetCap call to test connectivity */
  async ping(signal?: AbortSignal): Promise<SoapResult> {
    const endpoint = resolveEndpoint(this.cfg);
    const envelope = `<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
  <SOAP-ENV:Body>
    <WMLS_GetCap xmlns="http://www.witsml.org/message/120">
      <OptionsIn>dataVersion=1.4.1.1</OptionsIn>
    </WMLS_GetCap>
  </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`;

    try {
      const response = await fetch(endpoint, {
        method:  "POST",
        headers: {
          "Content-Type": "text/xml; charset=utf-8",
          "SOAPAction":   '"http://www.witsml.org/action/120/Store.WMLS_GetCap"',
          "Authorization": basicAuth(this.cfg.username, this.cfg.password),
        },
        body: envelope,
        signal,
      });
      const body = await response.text();
      if (!response.ok) return { ok: false, errorMessage: `HTTP ${response.status}` };
      return parseResult(body);
    } catch (err) {
      return { ok: false, errorMessage: err instanceof Error ? err.message : String(err) };
    }
  }
}
