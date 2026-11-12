import { basename } from "node:path";

// A client name can contain "../", which moves the file into the directory of another tenant.
export const safeFileName = (name: string) => {
  const fileName = basename(name.replaceAll("\\", "/"));

  if (!fileName || fileName === "." || fileName === "..") {
    throw new Error("Invalid file name");
  }

  return fileName;
};
