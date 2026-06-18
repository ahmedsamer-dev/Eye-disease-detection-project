export interface ScanResultDto {
  scanImageId: number;
  reportId: number;
  imagePath: string;
  condition: string;
  confidence: number;
  severity: string;
  iopEstimate?: string;
  retinalCupDiscRatio?: string;
  summary: string;
  recommendations: string[];
  analyzedAt: string;
}

// Deprecated Aliases for compatibility
export type ScanResult = ScanResultDto;
