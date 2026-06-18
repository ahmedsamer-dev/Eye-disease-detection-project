import axiosClient from '../axiosConfig';
import { ProfileDto, UpdateProfileRequestDto, UploadProfileImageResponseDto } from '../types/profile';

const profileService = {
  getProfile: async (): Promise<ProfileDto> => {
    const response = await axiosClient.get<ProfileDto>('/Profile');
    return response.data;
  },

  updateProfile: async (data: UpdateProfileRequestDto): Promise<ProfileDto> => {
    const response = await axiosClient.put<ProfileDto>('/Profile', data);
    return response.data;
  },

  uploadProfileImage: async (file: File): Promise<UploadProfileImageResponseDto> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosClient.post<UploadProfileImageResponseDto>('/Profile/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

export default profileService;
