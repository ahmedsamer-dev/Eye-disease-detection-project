export { default as axiosClient, getErrorMessage, getFullImageUrl } from './axiosConfig';
export { default as authService } from './services/authService';
export { default as profileService } from './services/profileService';
export { default as medicalHistoryService } from './services/medicalHistoryService';
export { default as scanService } from './services/scanService';
export { default as reportService } from './services/reportService';

export * from './types/auth';
export * from './types/profile';
export * from './types/medicalHistory';
export * from './types/scan';
export * from './types/report';
