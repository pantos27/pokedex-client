import React from 'react';
import {Pokemon} from '../../types/pokemon';
import {ICON_PLACEHOLDER} from '../../constants';
import {usePokemonCapture} from '../../hooks/usePokemonCapture';
import CheckmarkIcon from '../../assets/CheckmarkIcon';
import ErrorIcon from '../../assets/ErrorIcon';
import '../../styles/PokemonModal.css';

interface PokemonModalProps {
    pokemon: Pokemon;
    isOpen: boolean;
    onClose: () => void;
}

const PokemonModal: React.FC<PokemonModalProps> = ({pokemon, isOpen, onClose}) => {
    const {capture, captureStatus, isCapturing, handleCapture} = usePokemonCapture(pokemon.id);

    if (!isOpen) return null;

    const renderCaptureButton = () => {
        if (capture) {
            return (
                <button className="capture-button capture-success" disabled>
                    <CheckmarkIcon/>
                    Captured! at {new Date(capture.date_created).toLocaleString()}
                </button>
            );
        }

        if (captureStatus === 'loading' || isCapturing) {
            return (
                <button className="capture-button" disabled>
                    <div className="capture-spinner"></div>
                </button>
            );
        }

        if (captureStatus === 'error') {
            return (
                <button className="capture-button capture-error" disabled>
                    <ErrorIcon/>
                    Failed!
                </button>
            );
        }

        return (
            <button className="capture-button" onClick={handleCapture}>
                Capture
            </button>
        );
    };

    return (
        <div className="pokemon-modal-overlay" onClick={onClose}>
            <div className="pokemon-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>×</button>

                <div className="pokemon-modal-header">
                    <h2>{pokemon.name} #{pokemon.number}</h2>
                    {pokemon.legendary && <span className="legendary-indicator" title="Legendary Pokémon">⭐</span>}
                </div>

                <div className="pokemon-modal-body">
                    <div className="pokemon-image-container">
                        <img
                            src={pokemon.image}
                            alt={pokemon.name}
                            className="pokemon-large-image"
                            onError={(e) => {
                                e.currentTarget.src = ICON_PLACEHOLDER;
                            }}
                        />
                    </div>

                    <div className="pokemon-details">
                        <div className="pokemon-types">
                            <div className={`type-badge ${pokemon.type_one.toLowerCase()}`}>{pokemon.type_one}</div>
                            {pokemon.type_two && <div
                                className={`type-badge ${pokemon.type_two.toLowerCase()}`}>{pokemon.type_two}</div>}
                        </div>

                        <div className="pokemon-info">
                            <p><strong>Generation:</strong> {pokemon.generation}</p>

                            <h3>Stats</h3>
                            <div className="stats-grid">
                                <div className="stat-item">
                                    <span className="stat-label">HP:</span>
                                    <span className="stat-value">{pokemon.hit_points}</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">Attack:</span>
                                    <span className="stat-value">{pokemon.attack}</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">Defense:</span>
                                    <span className="stat-value">{pokemon.defense}</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">Sp. Attack:</span>
                                    <span className="stat-value">{pokemon.special_attack}</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">Sp. Defense:</span>
                                    <span className="stat-value">{pokemon.special_defense}</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">Speed:</span>
                                    <span className="stat-value">{pokemon.speed}</span>
                                </div>
                                <div className="stat-item total">
                                    <span className="stat-label">Total:</span>
                                    <span className="stat-value">{pokemon.total}</span>
                                </div>
                            </div>
                        </div>

                        <div className="capture-button-container">
                            {renderCaptureButton()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PokemonModal;
