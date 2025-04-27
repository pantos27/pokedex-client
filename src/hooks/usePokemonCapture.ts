import {useEffect, useState} from 'react';
import { useCapturePokemonApi } from '../api/useCaptureApi';
import {useAuth} from "../context/useAuth.ts";
import {Capture, User} from "../types/user.ts";

export type CaptureStatus = 'idle' | 'loading' | 'success' | 'error';

export const usePokemonCapture = (pokemonId: number) => {
  const [captureStatus, setCaptureStatus] = useState<CaptureStatus>('idle');
  const [capture, setCapture] = useState<Capture|undefined>();
  const { capturePokemon, isCapturing } = useCapturePokemonApi();
  const { user, setUser } = useAuth();

  useEffect(() => {
    const capture = user?.capturedPokemon?.find((cap)=>cap.pokemon_id===pokemonId);
    setCapture(capture);
    if (capture !== undefined){
      setCaptureStatus('success');
    }else{
      setCaptureStatus('idle');
    }
  }, [pokemonId, user?.capturedPokemon]);

  const handleCapture = async () => {
    try {
      setCaptureStatus('loading');
      const captureResponse = await capturePokemon({ pokemon_id: pokemonId });
      setCaptureStatus('success');

      // Update the user's capturedPokemon array in the auth context
      if (user) {
        const updatedUser: User = {
          ...user,
          capturedPokemon: [...(user.capturedPokemon || []), captureResponse]
        };
        setUser(updatedUser);
      }
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
    capture,
    captureStatus,
    isCapturing,
    handleCapture,
  };
};
