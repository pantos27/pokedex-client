import { useState } from 'react';
import { useCapturePokemonApi } from '../api/useCaptureApi';

export type CaptureStatus = 'idle' | 'loading' | 'success' | 'error';

export const usePokemonCapture = (pokemonId: number) => {
  const [captureStatus, setCaptureStatus] = useState<CaptureStatus>('idle');
  const { capturePokemon, isCapturing } = useCapturePokemonApi();

  const handleCapture = async () => {
    try {
      setCaptureStatus('loading');
      await capturePokemon({ pokemon_id: pokemonId });
      setCaptureStatus('success');
    } catch (error) {
      console.error('Error capturing pokemon:', error);
      setCaptureStatus('error');
      // Reset to idle after 3 seconds to allow the user to try again
      setTimeout(() => {
        setCaptureStatus('idle');
      }, 3000);
    }
  };

  return {
    captureStatus,
    isCapturing,
    handleCapture,
  };
};
