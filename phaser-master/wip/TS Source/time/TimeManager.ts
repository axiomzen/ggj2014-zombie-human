/// <reference path="../_definitions.ts" />

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
* @module       Phaser
*/
module Phaser {

    export class TimeManager {

        /**
        * This is the core internal game clock. It manages the elapsed time and calculation of delta values,
        * used for game object motion and tweens.
        *
        * @class TimeManager
        * @constructor
        * @param {Phaser.Game} game A reference to the currently running game.
        */
        constructor(game: Phaser.Game) {

            this.game = game;

            this._started = 0;
            this._timeLastSecond = this._started;
            this.time = this._started;

            this.game.onPause.add(this.gamePaused, this);
            this.game.onResume.add(this.gameResumed, this);

        }

        /**
        * A reference to the currently running Game.
        * @property game
        * @type {Phaser.Game}
        */
        public game: Phaser.Game;

        /**
        * The time at which the Game instance started.
        * @property _started
        * @private
        * @type {Number}
        */
        private _started: number;

        /**
        * Number of milliseconds elapsed since the last frame update.
        * @property elapsed
        * @public
        * @type {Number}
        */
        //public elapsed: number = 0;

        /**
        * The elapsed time calculated for the physics motion updates.
        * @property physicsElapsed
        * @public
        * @type {Number}
        */
        public physicsElapsed: number = 0;

        /**
        * Game time counter.
        * @property time
        * @public
        * @type {Number}
        */
        public time: number = 0;

        /**
        * Records how long the game has been paused for. Is reset each time the game pauses.
        * @property pausedTime
        * @public
        * @type {Number}
        */
        public pausedTime: number = 0;

        /**
        * The time right now.
        * @property now
        * @public
        * @type {Number}
        */
        public now: number = 0;

        /**
        * Elapsed time since the last frame.
        * @property delta
        * @public
        * @type {Number}
        */
        public delta: number = 0;

        /**
        * The number of seconds that have elapsed since the game was started.
        * @method totalElapsedSeconds
        * @return {Number}
        */
        public get totalElapsedSeconds(): number {

            return (this.now - this._started) * 0.001;

        }

        /**
        * Frames per second.
        * @property fps
        * @public
        * @type {Number}
        */
        public fps: number = 0;

        /**
        * The lowest rate the fps has dropped to.
        * @property fpsMin
        * @public
        * @type {Number}
        */
        public fpsMin: number = 1000;

        /**
        * The highest rate the fps has reached (usually no higher than 60fps).
        * @property fpsMax
        * @public
        * @type {Number}
        */
        public fpsMax: number = 0;

        /**
        * The minimum amount of time the game has taken between two frames.
        * @property msMin
        * @public
        * @type {Number}
        */
        public msMin: number = 1000;

        /**
        * The maximum amount of time the game has taken between two frames.
        * @property msMax
        * @public
        * @type {Number}
        */
        public msMax: number = 0;

        /**
        * The number of frames record in the last second.
        * @property frames
        * @public
        * @type {Number}
        */
        public frames: number = 0;

        /**
        * The time (in ms) that the last second counter ticked over.
        * @property _timeLastSecond
        * @private
        * @type {Number}
        */
        private _timeLastSecond: number = 0;

        /**
         * Update clock and calculate the fps.
         * This is called automatically by Game._raf
         * @method update
         * @param {Number} raf The current timestamp, either performance.now or Date.now
         */
        public update(raf: number) {

            this.now = raf; // mark
            this.delta = this.now - this.time; // elapsedMS

            this.msMin = Math.min(this.msMin, this.delta);
            this.msMax = Math.max(this.msMax, this.delta);

            this.frames++;

            if (this.now > this._timeLastSecond + 1000)
            {
                this.fps = Math.round((this.frames * 1000) / (this.now - this._timeLastSecond));
                this.fpsMin = Math.min(this.fpsMin, this.fps);
                this.fpsMax = Math.max(this.fpsMax, this.fps);

                this._timeLastSecond = this.now;
                this.frames = 0;
            }

            this.time = this.now; // _total

            this.physicsElapsed = 1.0 * (this.delta / 1000);

            //  Paused?
            if (this.game.paused)
            {
                this.pausedTime = this.now - this._pauseStarted;
            }

        }

        /**
        * Called when the game enters a paused state.
        * @method gamePaused
        * @private
        */
        private gamePaused() {
            this._pauseStarted = this.now;
        }

        /**
        * Called when the game resumes from a paused state.
        * @method gameResumed
        * @private
        */
        private gameResumed() {

            //  Level out the delta timer to avoid spikes
            this.delta = 0;
            this.physicsElapsed = 0;
            this.time = Date.now();
            this.pauseDuration = this.pausedTime;

        }

        /**
        * Records how long the game was paused for in miliseconds.
        * @property pauseDuration
        * @public
        * @type {Number}
        */
        public pauseDuration: number = 0;

        /**
        * The time the game started being paused.
        * @property _pauseStarted
        * @private
        * @type {Number}
        */
        private _pauseStarted: number = 0;

        /**
        * How long has passed since the given time.
        * @method elapsedSince
        * @param {Number} since The time you want to measure against.
        * @return {Number} The difference between the given time and now.
        */
        public elapsedSince(since: number): number {

            return this.now - since;

        }

        /**
        * How long has passed since the given time (in seconds).
        * @method elapsedSecondsSince
        * @param {Number} since The time you want to measure (in seconds).
        * @return {Number} Duration between given time and now (in seconds).
        */
        public elapsedSecondsSince(since: number): number {

            return (this.now - since) * 0.001;

        }

        /**
        * Resets the private _started value to now.
        * @method reset
        */
        public reset() {

            this._started = this.now;

        }

    }

}