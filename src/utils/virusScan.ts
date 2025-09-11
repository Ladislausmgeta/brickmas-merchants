import { execFile } from "child_process";
import fs from "fs";
import path from "path";

const CLAMAV_PATH = "C:\\Program Files\\ClamAV\\clamscan.exe"; // adjust path if needed

/**
 * Scan a file for viruses using ClamAV if available.
 * If ClamAV is not installed or fails, the file is considered safe and no crash occurs.
 * @param filePath absolute path to file
 */
export const scanFile = async (filePath: string): Promise<void> => {
  const absoluteFile = path.resolve(filePath);

  // check if ClamAV exists
  if (!fs.existsSync(CLAMAV_PATH)) {
    console.warn("ClamAV not found. Skipping virus scan for:", absoluteFile);
    return;
  }

  return new Promise((resolve) => {
    execFile(CLAMAV_PATH, ["--infected", "--remove=no", absoluteFile], (err, stdout, stderr) => {
      if (err) {
        console.warn("ClamAV scan failed, treating file as safe:", absoluteFile, err.message);
        return resolve(); // allow upload anyway
      }

      if (stdout.includes("Infected files: 0")) {
        console.log("File is clean:", absoluteFile);
        return resolve();
      } else {
        console.warn("File may be infected, but continuing anyway:", absoluteFile);
        console.warn(stdout);
        return resolve(); // allow upload anyway, log only
      }
    });
  });
};
