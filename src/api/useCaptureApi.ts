import { useApi } from './useApi';

export interface CaptureRequest {
  pokemon_id: number;
}

export interface CaptureResponse {
  date_created: Date;
  pokemon_id: number;
}

const POKEMON_API_URL = '/api/captures';

export const useCapturePokemonApi = () => {
  const { useApiMutation } = useApi();

  // Capture mutation
  const capturePokemon = useApiMutation<CaptureResponse, CaptureRequest>();

  const capturePokemonFn = (data: CaptureRequest) => {
    return capturePokemon.mutateAsync({
      url: POKEMON_API_URL,
      data,
    });
  };

  return {
    capturePokemon: capturePokemonFn,
    isCapturing: capturePokemon.isPending,
    captureError: capturePokemon.error,
    captureReset: capturePokemon.reset,
  };
};
