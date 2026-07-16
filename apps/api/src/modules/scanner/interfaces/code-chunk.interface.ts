export interface CodeChunk {
  filePath: string;
  chunkNumber: number;
  totalChunks: number;
  language: string;
  content: string;
}