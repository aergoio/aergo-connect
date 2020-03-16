import { EventEmitter } from 'events';

const IDLE_TIMEOUT = 60 * 1000;

class AppState extends EventEmitter {
    private idleTimeout?: NodeJS.Timeout;
    public state = '';

    constructor() {
        super();
        this.set('initial');
    }

    /**
     * App states: initial -> active -> inactive -> idle
     * Opening UI switches state to active. Closing UI switches state to inactive.
     * After being inactive for a certain amount of time, switch to idle.
     * @param {string} nextState 
     */
    set(nextState: string): void {
        if (nextState != 'inactive') {
            if (this.idleTimeout) {
                clearTimeout(this.idleTimeout);
            }
        }
        if (this.state != nextState && nextState == 'inactive') {
            if (this.idleTimeout) {
                clearTimeout(this.idleTimeout);
            }
            this.idleTimeout = setTimeout(() => {
                this.set('idle');
            }, IDLE_TIMEOUT);
        }
        if (this.state != nextState) {
            console.log(`[state] ${this.state} -> ${nextState}`);
        }
        this.state = nextState;
        this.emit('change', nextState);
        this.emit(nextState);
    }
}

export default AppState;