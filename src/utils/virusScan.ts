import { execFile } from "child_process";
import path from "path";

export const scanFile = (filePath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const clamPath = `"C:\Program Files\ClamAV"`; // adjust path
    const absoluteFile = path.resolve(filePath);

    execFile(clamPath, ["--infected", "--remove=no", absoluteFile], (err, stdout) => {
      if (err) {
        return reject(new Error(`ClamAV scan failed: ${err.message}`));
      }

      if (stdout.includes("Infected files: 0")) {
        resolve();
      } else {
        reject(new Error(`File is infected: ${stdout}`));
      }
    });
  });
};