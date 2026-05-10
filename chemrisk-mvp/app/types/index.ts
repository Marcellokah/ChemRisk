export type UploadStatus = "IDLE" | "UPLOADING" | "SUCCESS" | "ERROR";

export interface UploadState {
  status: UploadStatus;
  fileNames: string[];
  progress: number; // 0-100
  errorMessage?: string;
}

export interface ExtractedIngredient {
  name: string;
  casNumber: string;
  concentration: string;
}

export interface ExtractedData {
  fileName?: string;
  productName: string;
  ingredients: ExtractedIngredient[];
  hazardClasses: string[];
  hStatements: string[];
  pStatements: string[];
}
