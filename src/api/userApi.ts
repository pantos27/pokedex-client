import { useApi } from './useApi';
import {CaptureResponse} from "./useCaptureApi.ts";

export interface UserRegistrationRequest {
  user_name: string;
}

export interface UserResponse {
  id: string;
  user_name: string;
  captured_pokemon: CaptureResponse[];
}

const USER_API_URL = '/api/users';

export const useGetUserById = (userId: string | null) => {
  const { useApiQuery } = useApi();

  return useApiQuery<UserResponse>(
    userId ? `${USER_API_URL}/${userId}` : '',
    ['user', userId || ''],
    { enabled: !!userId }
  );
};

export const useUserApi = () => {
  const { useApiMutation } = useApi();

  // Registration mutation
  const registerUser = useApiMutation<UserResponse, UserRegistrationRequest>();

  const registerUserFn = (data: UserRegistrationRequest) => {
    return registerUser.mutateAsync({
      url: USER_API_URL,
      data,
    });
  };

  return {
    registerUser: registerUserFn,
    isRegistering: registerUser.isPending,
  };
};
