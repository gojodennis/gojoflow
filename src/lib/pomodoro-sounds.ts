// Sound utility for Pomodoro timer using Web Audio API

class PomodoroSoundManager {
    private audioContext: AudioContext | null = null;
    private volume: number = 0.7;

    constructor() {
        // Lazy initialization of AudioContext
        if (typeof window !== 'undefined') {
            const AudioContextClass = window.AudioContext || (window as typeof globalThis & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
            this.audioContext = AudioContextClass ? new AudioContextClass() : null;
        }
    }

    setVolume(volume: number) {
        this.volume = Math.max(0, Math.min(1, volume / 100));
    }

    // Play a simple tone
    private playTone(frequency: number, duration: number = 0.2, fadeOut: boolean = true) {
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);

        if (fadeOut) {
            gainNode.gain.exponentialRampToValueAtTime(
                0.01,
                this.audioContext.currentTime + duration
            );
        }

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    // Default preset: Two-tone notification
    private playDefault() {
        this.playTone(800, 0.15);
        setTimeout(() => this.playTone(1000, 0.2), 100);
    }

    // Gentle preset: Soft ascending tones
    private playGentle() {
        this.playTone(523.25, 0.3); // C5
        setTimeout(() => this.playTone(659.25, 0.3), 150); // E5
        setTimeout(() => this.playTone(783.99, 0.4), 300); // G5
    }

    // Bell preset: Bell-like sound
    private playBell() {
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'triangle';

        gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            this.audioContext.currentTime + 1.5
        );

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 1.5);
    }

    playTick() {
        this.playTone(440, 0.05, false);
    }

    // Session start sound
    playSessionStart(preset: 'default' | 'gentle' | 'bell' | 'none' = 'default') {
        if (preset === 'none') return;

        switch (preset) {
            case 'default':
                this.playDefault();
                break;
            case 'gentle':
                this.playGentle();
                break;
            case 'bell':
                this.playBell();
                break;
        }
    }

    // Session end sound - same as start for now, can be customized
    playSessionEnd(preset: 'default' | 'gentle' | 'bell' | 'none' = 'default') {
        if (preset === 'none') return;

        switch (preset) {
            case 'default':
                // Play a different pattern for end
                this.playTone(1000, 0.15);
                setTimeout(() => this.playTone(800, 0.15), 100);
                setTimeout(() => this.playTone(1000, 0.2), 200);
                break;
            case 'gentle':
                this.playGentle();
                break;
            case 'bell':
                this.playBell();
                break;
        }
    }

    // Test sound
    testSound(preset: 'default' | 'gentle' | 'bell' | 'none' = 'default') {
        this.playSessionEnd(preset);
    }
}

// Export singleton instance
export const soundManager = new PomodoroSoundManager();
