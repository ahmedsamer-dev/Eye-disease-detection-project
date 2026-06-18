import axiosClient from '../axiosConfig';
import { MedicalHistoryDto, CreateMedicalHistoryRequestDto } from '../types/medicalHistory';

const medicalHistoryService = {
  create: async (data: CreateMedicalHistoryRequestDto): Promise<MedicalHistoryDto> => {
    const response = await axiosClient.post<MedicalHistoryDto>('/medical-history', data);
    return response.data;
  },

  getAll: async (): Promise<MedicalHistoryDto[]> => {
    const response = await axiosClient.get<MedicalHistoryDto[]>('/medical-history');
    console.log(response.data);
    return response.data;
  },

  getById: async (id: number): Promise<MedicalHistoryDto> => {
    const response = await axiosClient.get<MedicalHistoryDto>(`/medical-history/${id}`);
    return response.data;
  }
};

export default medicalHistoryService;
