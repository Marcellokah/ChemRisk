export type UploadStatus = "IDLE" | "UPLOADING" | "SUCCESS" | "ERROR";

export interface UploadState {
  status: UploadStatus;
  fileName: string | null;
  progress: number; // 0-100
  errorMessage?: string;
}

export interface ExtractedIngredient {
  name: string;
  casNumber: string;
  concentration: string;
}

export interface ExtractedData {
  productName: string;
  ingredients: ExtractedIngredient[];
  hazardClasses: string[];
  hStatements: string[];
  pStatements: string[];
}
