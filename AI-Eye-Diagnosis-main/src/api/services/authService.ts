import axiosClient from '../axiosConfig';
import { 
  AuthResponseDto, 
  LoginRequestDto, 
  RegisterRequestDto, 
  GoogleLoginRequestDto, 
  ForgotPasswordRequestDto, 
  ResetPasswordRequestDto,
  ChangePasswordRequestDto
} from '../types/auth';

const authService = {
  register: async (data: RegisterRequestDto): Promise<AuthResponseDto> => {
    const response = await axiosClient.post<AuthResponseDto>('/auth/register', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  login: async (data: LoginRequestDto): Promise<AuthResponseDto> => {
    const response = await axiosClient.post<AuthResponseDto>('/auth/login', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  googleLogin: async (data: GoogleLoginRequestDto): Promise<AuthResponseDto> => {
    const response = await axiosClient.post<AuthResponseDto>('/auth/google-login', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordRequestDto): Promise<{ message: string; resetCode?: string }> => {
    const response = await axiosClient.post('/auth/forgot-password', data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordRequestDto): Promise<{ message: string }> => {
    const response = await axiosClient.post('/auth/reset-password', data);
    return response.data;
  },

  changePassword: async (data: ChangePasswordRequestDto): Promise<{ message: string }> => {
    const response = await axiosClient.post('/auth/change-password', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await axiosClient.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
    }
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  }
};

export default authService;
