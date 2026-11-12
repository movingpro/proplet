export interface IFileStorage {
  saveFile(path: string, buffer: Buffer): Promise<void>;
  readFile(path: string): Promise<Buffer>;
  deleteFile(path: string): Promise<void>;
}
