export interface ProfileDto {
  id: string;
  fullName: string;
  preferredName?: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: number;
  address?: string;
  profileImageUrl?: string;
  createdAt: string;
}

export interface UpdateProfileRequestDto {
  fullName?: string;
  preferredName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: number;
  address?: string;
  profileImageUrl?: string;
}

export interface UploadProfileImageResponseDto {
  imageUrl: string;
}

// Deprecated Aliases for compatibility
export type Profile = ProfileDto;
export type UpdateProfileRequest = UpdateProfileRequestDto;

