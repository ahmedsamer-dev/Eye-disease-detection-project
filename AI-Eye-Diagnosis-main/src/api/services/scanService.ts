import axiosClient from '../axiosConfig';
import { ScanResultDto } from '../types/scan';

const scanService = {
  upload: async (file: File, eyeSide?: string): Promise<ScanResultDto> => {
    const formData = new FormData();
    formData.append('file', file);
    if (eyeSide) {
      formData.append('eyeSide', eyeSide);
    }

    const response = await axiosClient.post<ScanResultDto>('/Scans/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getById: async (id: number): Promise<ScanResultDto> => {
    const response = await axiosClient.get<ScanResultDto>(`/Scans/${id}`);
    return response.data;
  }
};

export default scanService;
