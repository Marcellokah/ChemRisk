export type UploadStatus = "IDLE" | "UPLOADING" | "SUCCESS" | "ERROR";

export interface UploadState {
  status: UploadStatus;
  fileName: string | null;
  progress: number; // 0-100
  errorMessage?: string;
}

// Mock adat a későbbi backend válaszhoz
export interface ExtractedDataPreview {
  productName: string;
  casNumber: string;
  hazardStatements: string[];
}
