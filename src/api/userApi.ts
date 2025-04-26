import { useApi } from './useApi';

export interface UserRegistrationRequest {
  user_name: string;
}

export interface UserRegistrationResponse {
  id: string;
  user_name: string;
  captured_pokemon: string[];
}

const USER_API_URL = '/api/users';

export const useUserApi = () => {
  const { useApiMutation } = useApi();

  const registerUser = useApiMutation<UserRegistrationResponse, UserRegistrationRequest>();

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
