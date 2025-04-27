import {useState} from 'react';
import {useAuth} from '../context/useAuth';
import {useUserApi} from '../api/userApi';

export const useUserRegistration = () => {
    const [username, setUsername] = useState('');
    const [error, setError] = useState<string | null>(null);
    const {setUser} = useAuth();
    const {registerUser, isRegistering} = useUserApi();

    const handleUsernameChange = (newUsername: string) => {
        setUsername(newUsername);
    };

    const handleRegisterUser = async () => {
        if (!username.trim()) {
            setError('Username is required');
            return;
        }

        setError(null);

        try {
            const result = await registerUser({user_name: username});

            if (result.id) {
                setUser({
                    id: result.id,
                    username: result.user_name,
                    capturedPokemon: result.captured_pokemon
                });
            } else {
                throw new Error('User ID not received from server');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            throw err;
        }
    };

    return {
        username,
        error,
        isSubmitting: isRegistering,
        handleUsernameChange,
        registerUser: handleRegisterUser,
    };
};
