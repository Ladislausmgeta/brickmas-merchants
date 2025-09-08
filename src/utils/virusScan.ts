import NodeClam from "clamscan";
import path from "path";

let clamscanInstance: any = null;

export async function getClamScan() {
  if (clamscanInstance) return clamscanInstance;
  clamscanInstance = await new NodeClam().init({
    removeInfected: false,
    clamdscan: {
      socket: false,
      host: process.env.CLAMD_HOST || "127.0.0.1",
      port: Number(process.env.CLAMD_PORT || 3310),
      timeout: 60000,
    },
    preference: "clamdscan",
  });
  return clamscanInstance;
}

/**
 * Scans file at filePath. Throws error if infected or if ClamAV not reachable.
 */
export async function scanFile(filePath: string) {
  const clamscan = await getClamScan();
  const res = await clamscan.isInfected(filePath);
  // NodeClam returns object { isInfected, viruses }
  if (res.isInfected) {
    throw new Error(`File infected: ${res.viruses?.join?.(", ") || JSON.stringify(res.viruses)}`);
  }
  return true;
}
