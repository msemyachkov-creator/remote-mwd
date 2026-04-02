// ─── WITSML 1.4.1.1 XML Builders ─────────────────────────────────────────────
//
// Each function returns a well-formed WITSML 1.4.1.1 XML string for
// WMLS_AddToStore / WMLS_UpdateInStore calls.
//
// Spec ref: http://www.witsml.org/schemas/1series (version 1.4.1.1)
// ─────────────────────────────────────────────────────────────────────────────

import type {
  WitsmlWellRef,
  SurveySnapshot,
  DepthSnapshot,
  DecodedSnapshot,
  CurvesSnapshot,
} from "./types";

const NS = `xmlns="http://www.witsml.org/schemas/1series" version="1.4.1.1"`;

// ─── helpers ─────────────────────────────────────────────────────────────────

function esc(v: string | number): string {
  return String(v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function ft(v: number): string { return v.toFixed(3); }
function deg(v: number): string { return v.toFixed(4); }

// ─── Survey / Trajectory ─────────────────────────────────────────────────────

export function buildTrajectoryXml(
  well: WitsmlWellRef,
  trajectoryUid: string,
  trajectoryName: string,
  aziRef: string,
  stations: SurveySnapshot[]
): string {
  const stationsXml = stations
    .map(
      (s, i) => `
    <trajStation uid="stn-${i + 1}">
      <dTimStn>${esc(s.timestamp)}</dTimStn>
      <typeTrajStation>MWD</typeTrajStation>
      <md uom="ft">${ft(s.mdFt)}</md>
      <incl uom="dega">${deg(s.inclDeg)}</incl>
      <azi uom="dega">${deg(s.aziDeg)}</azi>
      <tvd uom="ft">${ft(s.tvdFt)}</tvd>
      <dispNs uom="ft">${ft(s.nsFt)}</dispNs>
      <dispEw uom="ft">${ft(s.ewFt)}</dispEw>
      <dls uom="dega/30m">${deg(s.dlsDegPer100ft)}</dls>
      <gravTotalUncert>${deg(s.totalG)}</gravTotalUncert>
      <magTotalUncert>${deg(s.totalB)}</magTotalUncert>
      <magDipAngleUncert>${deg(s.magDip)}</magDipAngleUncert>
    </trajStation>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<trajectorys ${NS}>
  <trajectory uidWell="${esc(well.wellUid)}" uidWellbore="${esc(well.wellboreUid)}" uid="${esc(trajectoryUid)}">
    <name>${esc(trajectoryName)}</name>
    <nameWell>${esc(well.wellName)}</nameWell>
    <nameWellbore>${esc(well.wellboreName)}</nameWellbore>
    <aziRef>${esc(aziRef)}</aziRef>
    <mdMn uom="ft">${ft(stations[0]?.mdFt ?? 0)}</mdMn>
    <mdMx uom="ft">${ft(stations[stations.length - 1]?.mdFt ?? 0)}</mdMx>${stationsXml}
  </trajectory>
</trajectorys>`;
}

// ─── Depth log (DEPTH, HDEP, ROP) ────────────────────────────────────────────

export function buildDepthLogXml(
  well: WitsmlWellRef,
  logUid: string,
  rows: DepthSnapshot[]
): string {
  const dataRows = rows
    .map(r => `      <data>${ft(r.bitDepthFt)},${ft(r.holeDepthFt)},${r.ropFtPerHr.toFixed(2)}</data>`)
    .join("\n");

  const mdMin = rows[0]?.bitDepthFt ?? 0;
  const mdMax = rows[rows.length - 1]?.bitDepthFt ?? 0;

  return `<?xml version="1.0" encoding="UTF-8"?>
<logs ${NS}>
  <log uidWell="${esc(well.wellUid)}" uidWellbore="${esc(well.wellboreUid)}" uid="${esc(logUid)}">
    <name>Depth &amp; ROP Log — Run ${well.runNumber}</name>
    <nameWell>${esc(well.wellName)}</nameWell>
    <nameWellbore>${esc(well.wellboreName)}</nameWellbore>
    <indexType>measured depth</indexType>
    <startIndex uom="ft">${ft(mdMin)}</startIndex>
    <endIndex uom="ft">${ft(mdMax)}</endIndex>
    <direction>increasing</direction>
    <indexCurve>DEPTH</indexCurve>
    <logCurveInfo uid="DEPTH">
      <mnemonic>DEPTH</mnemonic>
      <unit>ft</unit>
      <curveDescription>Bit Depth</curveDescription>
      <typeLogData>double</typeLogData>
    </logCurveInfo>
    <logCurveInfo uid="HDEP">
      <mnemonic>HDEP</mnemonic>
      <unit>ft</unit>
      <curveDescription>Hole Depth</curveDescription>
      <typeLogData>double</typeLogData>
    </logCurveInfo>
    <logCurveInfo uid="ROP">
      <mnemonic>ROP</mnemonic>
      <unit>ft/h</unit>
      <curveDescription>Rate of Penetration</curveDescription>
      <typeLogData>double</typeLogData>
    </logCurveInfo>
    <logData>
      <mnemonicList>DEPTH,HDEP,ROP</mnemonicList>
      <unitList>ft,ft,ft/h</unitList>
${dataRows}
    </logData>
  </log>
</logs>`;
}

// ─── Time log (GTF, MTF, TF, INC, AZI — decoded MWD params) ─────────────────

export function buildDecodedLogXml(
  well: WitsmlWellRef,
  logUid: string,
  rows: DecodedSnapshot[]
): string {
  const dataRows = rows
    .map(
      r =>
        `      <data>${esc(r.timestamp)},${deg(r.gtfDeg)},${deg(r.mtfDeg)},${deg(r.toolfaceDeg)},${deg(r.inclDeg)},${deg(r.aziDeg)},${r.packetsDecoded}</data>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<logs ${NS}>
  <log uidWell="${esc(well.wellUid)}" uidWellbore="${esc(well.wellboreUid)}" uid="${esc(logUid)}">
    <name>Decoded MWD Parameters — Run ${well.runNumber}</name>
    <nameWell>${esc(well.wellName)}</nameWell>
    <nameWellbore>${esc(well.wellboreName)}</nameWellbore>
    <indexType>date time</indexType>
    <startDateTimeIndex>${esc(rows[0]?.timestamp ?? "")}</startDateTimeIndex>
    <endDateTimeIndex>${esc(rows[rows.length - 1]?.timestamp ?? "")}</endDateTimeIndex>
    <indexCurve>TIME</indexCurve>
    <logCurveInfo uid="TIME">
      <mnemonic>TIME</mnemonic>
      <unit>s</unit>
      <curveDescription>Timestamp</curveDescription>
      <typeLogData>date time</typeLogData>
    </logCurveInfo>
    <logCurveInfo uid="GTF">
      <mnemonic>GTF</mnemonic>
      <unit>dega</unit>
      <curveDescription>Gravity Toolface</curveDescription>
      <typeLogData>double</typeLogData>
    </logCurveInfo>
    <logCurveInfo uid="MTF">
      <mnemonic>MTF</mnemonic>
      <unit>dega</unit>
      <curveDescription>Magnetic Toolface</curveDescription>
      <typeLogData>double</typeLogData>
    </logCurveInfo>
    <logCurveInfo uid="TF">
      <mnemonic>TF</mnemonic>
      <unit>dega</unit>
      <curveDescription>Current Toolface</curveDescription>
      <typeLogData>double</typeLogData>
    </logCurveInfo>
    <logCurveInfo uid="INC">
      <mnemonic>INC</mnemonic>
      <unit>dega</unit>
      <curveDescription>Inclination</curveDescription>
      <typeLogData>double</typeLogData>
    </logCurveInfo>
    <logCurveInfo uid="AZI">
      <mnemonic>AZI</mnemonic>
      <unit>dega</unit>
      <curveDescription>Azimuth</curveDescription>
      <typeLogData>double</typeLogData>
    </logCurveInfo>
    <logCurveInfo uid="PKT">
      <mnemonic>PKT</mnemonic>
      <unit>unitless</unit>
      <curveDescription>Packets Decoded</curveDescription>
      <typeLogData>long</typeLogData>
    </logCurveInfo>
    <logData>
      <mnemonicList>TIME,GTF,MTF,TF,INC,AZI,PKT</mnemonicList>
      <unitList>s,dega,dega,dega,dega,dega,unitless</unitList>
${dataRows}
    </logData>
  </log>
</logs>`;
}

// ─── Depth log — Curves (GR …) ───────────────────────────────────────────────

export function buildCurvesLogXml(
  well: WitsmlWellRef,
  logUid: string,
  rows: CurvesSnapshot[]
): string {
  const dataRows = rows
    .map(r => `      <data>${ft(r.mdFt)},${r.gammaCps.toFixed(2)}</data>`)
    .join("\n");

  const mdMin = rows[0]?.mdFt ?? 0;
  const mdMax = rows[rows.length - 1]?.mdFt ?? 0;

  return `<?xml version="1.0" encoding="UTF-8"?>
<logs ${NS}>
  <log uidWell="${esc(well.wellUid)}" uidWellbore="${esc(well.wellboreUid)}" uid="${esc(logUid)}">
    <name>Curves — Run ${well.runNumber}</name>
    <nameWell>${esc(well.wellName)}</nameWell>
    <nameWellbore>${esc(well.wellboreName)}</nameWellbore>
    <indexType>measured depth</indexType>
    <startIndex uom="ft">${ft(mdMin)}</startIndex>
    <endIndex uom="ft">${ft(mdMax)}</endIndex>
    <direction>increasing</direction>
    <indexCurve>DEPT</indexCurve>
    <logCurveInfo uid="DEPT">
      <mnemonic>DEPT</mnemonic>
      <unit>ft</unit>
      <curveDescription>Measured Depth Index</curveDescription>
      <typeLogData>double</typeLogData>
    </logCurveInfo>
    <logCurveInfo uid="GR">
      <mnemonic>GR</mnemonic>
      <unit>gAPI</unit>
      <curveDescription>Gamma Ray</curveDescription>
      <typeLogData>double</typeLogData>
    </logCurveInfo>
    <logData>
      <mnemonicList>DEPT,GR</mnemonicList>
      <unitList>ft,gAPI</unitList>
${dataRows}
    </logData>
  </log>
</logs>`;
}
