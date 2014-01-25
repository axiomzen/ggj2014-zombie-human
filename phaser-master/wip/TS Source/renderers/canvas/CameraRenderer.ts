/// <reference path="../../_definitions.ts" />

module Phaser.Renderer.Canvas {

    export class CameraRenderer {

        constructor(game: Phaser.Game) {
            this.game = game;
        }

        /**
         * The essential reference to the main game object
         */
        public game: Phaser.Game;

        private _ga: number = 1;
        private _sx: number = 0;
        private _sy: number = 0;
        private _sw: number = 0;
        private _sh: number = 0;
        private _dx: number = 0;
        private _dy: number = 0;
        private _dw: number = 0;
        private _dh: number = 0;
        private _fx: number = 1;
        private _fy: number = 1;
        private _tx: number = 0;
        private _ty: number = 0;
        private _gac: number = 1;
        private _sin: number = 0;
        private _cos: number = 1;

        public preRender(camera: Phaser.Camera): bool {

            if (camera.visible == false || camera.transform.scale.x == 0 || camera.transform.scale.y == 0 || camera.texture.alpha < 0.1)
            {
                return false;
            }

            if (this.game.device.patchAndroidClearRectBug)
            {
                camera.texture.context.fillStyle = 'rgb(0,0,0)';
                camera.texture.context.fillRect(0, 0, camera.width, camera.height);
            }
            else
            {
                camera.texture.context.clearRect(0, 0, camera.width, camera.height);
            }

            //  Alpha
            if (camera.texture.alpha !== 1 && camera.texture.context.globalAlpha != camera.texture.alpha)
            {
                this._ga = camera.texture.context.globalAlpha;
                camera.texture.context.globalAlpha = camera.texture.alpha;
            }

            if (camera.texture.opaque)
            {
                camera.texture.context.fillStyle = camera.texture.backgroundColor;
                camera.texture.context.fillRect(0, 0, camera.width, camera.height);
            }

            //if (camera.texture.loaded)
            //{
            //    camera.texture.context.drawImage(
            //        camera.texture.texture,	    //	Source Image
            //        this._sx, 			//	Source X (location within the source image)
            //        this._sy, 			//	Source Y
            //        this._sw, 			//	Source Width
            //        this._sh, 			//	Source Height
            //        0, 			        //	Destination X (where on the canvas it'll be drawn)
            //        0, 			        //	Destination Y
            //        this._dw, 			//	Destination Width (always same as Source Width unless scaled)
            //        this._dh			//	Destination Height (always same as Source Height unless scaled)
            //    );
            //}

            //  Global Composite Ops
            if (camera.texture.globalCompositeOperation)
            {
                camera.texture.context.globalCompositeOperation = camera.texture.globalCompositeOperation;
            }

            camera.plugins.preRender();

        }

        public postRender(camera: Phaser.Camera) {

            //  This could have been over-written by a sprite, need to store elsewhere
            if (this._ga > -1)
            {
                camera.texture.context.globalAlpha = this._ga;
            }

            camera.plugins.postRender();

            //  Reset our temp vars
            this._ga = -1;
            this._sx = 0;
            this._sy = 0;
            this._sw = camera.width;
            this._sh = camera.height;
            this._fx = camera.transform.scale.x;
            this._fy = camera.transform.scale.y;
            this._sin = 0;
            this._cos = 1;
            this._dx = camera.screenView.x;
            this._dy = camera.screenView.y;
            this._dw = camera.width;
            this._dh = camera.height;

            this.game.stage.context.save();

            //  Flip X
            if (camera.texture.flippedX)
            {
                this._fx = -camera.transform.scale.x;
            }

            //  Flip Y
            if (camera.texture.flippedY)
            {
                this._fy = -camera.transform.scale.y;
            }

            //	Rotation and Flipped
            if (camera.modified)
            {
                if (camera.transform.rotation !== 0 || camera.transform.rotationOffset !== 0)
                {
                    this._sin = Math.sin(camera.game.math.degreesToRadians(camera.transform.rotationOffset + camera.transform.rotation));
                    this._cos = Math.cos(camera.game.math.degreesToRadians(camera.transform.rotationOffset + camera.transform.rotation));
                }

                this.game.stage.context.setTransform(
                    this._cos * this._fx,                               //  scale x
                    (this._sin * this._fx) + camera.transform.skew.x,   //  skew x
                    -(this._sin * this._fy) + camera.transform.skew.y,  //  skew y
                    this._cos * this._fy,                               //  scale y
                    this._dx,                                           //  translate x
                    this._dy                                            //  translate y
                    );

                this._dx = camera.transform.origin.x * -this._dw;
                this._dy = camera.transform.origin.y * -this._dh;
            }
            else
            {
                this._dx -= (this._dw * camera.transform.origin.x);
                this._dy -= (this._dh * camera.transform.origin.y);
            }

            this._sx = Math.floor(this._sx);
            this._sy = Math.floor(this._sy);
            this._sw = Math.floor(this._sw);
            this._sh = Math.floor(this._sh);
            this._dx = Math.floor(this._dx);
            this._dy = Math.floor(this._dy);
            this._dw = Math.floor(this._dw);
            this._dh = Math.floor(this._dh);

            if (this._sw <= 0 || this._sh <= 0 || this._dw <= 0 || this._dh <= 0)
            {
                this.game.stage.context.restore();
                return false;
            }

            this.game.stage.context.drawImage(
                camera.texture.canvas,	    //	Source Image
                this._sx, 			//	Source X (location within the source image)
                this._sy, 			//	Source Y
                this._sw, 			//	Source Width
                this._sh, 			//	Source Height
                this._dx, 			//	Destination X (where on the canvas it'll be drawn)
                this._dy, 			//	Destination Y
                this._dw, 			//	Destination Width (always same as Source Width unless scaled)
                this._dh			//	Destination Height (always same as Source Height unless scaled)
                );

            this.game.stage.context.restore();

        }

    }

}