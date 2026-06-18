export interface MedicalHistoryDto {
  id: number;
  doctorId: string;
  hasDiabetes: boolean;
  hasGlaucoma: boolean;
  hasCataracts: boolean;
  hasOther: boolean;
  otherSpecification?: string;
  normalEye: boolean;
  currentMedications?: string;
  allergiesToMedications?: string;
  wearGlassesOrContacts?: string;
  contactsBrandType?: string;
  lastEyeExam?: string;
  pastEyeSurgeries?: string;
  privacyConsent: boolean;
  createdAt: string;
}

export interface CreateMedicalHistoryRequestDto {
  hasDiabetes: boolean;
  hasGlaucoma: boolean;
  hasCataracts: boolean;
  hasOther: boolean;
  otherSpecification?: string;
  normalEye: boolean;
  currentMedications?: string;
  allergiesToMedications?: string;
  wearGlassesOrContacts?: string;
  contactsBrandType?: string;
  lastEyeExam?: string;
  pastEyeSurgeries?: string;
  privacyConsent: boolean;
}

// Deprecated Aliases for compatibility
export type MedicalHistory = MedicalHistoryDto;
export type CreateMedicalHistoryRequest = CreateMedicalHistoryRequestDto;
