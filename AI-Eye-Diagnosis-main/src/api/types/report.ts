export interface RecommendationDto {
  orderIndex: number;
  text: string;
}

export interface DiagnosisReportDto {
  id: number;
  scanImageId: number;
  imagePath: string;
  condition: string;
  confidence: number;
  severity: string;
  iopEstimate?: string;
  retinalCupDiscRatio?: string;
  summary: string;
  isSaved: boolean;
  createdAt: string;
  recommendations: RecommendationDto[];
}

export interface ReportSummaryDto {
  id: number;
  condition: string;
  confidence: number;
  severity: string;
  createdAt: string;
  imagePath: string;
}

export interface ReportsResponseDto {
  count: number;
  reports: ReportSummaryDto[];
}

// Deprecated Aliases for compatibility
export type Recommendation = RecommendationDto;
export type DiagnosisReport = DiagnosisReportDto;
export type ReportSummary = ReportSummaryDto;
export type ReportsResponse = ReportsResponseDto;
