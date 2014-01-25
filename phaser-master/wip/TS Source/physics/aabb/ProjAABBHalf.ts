/// <reference path="../../_definitions.ts" />

/**
* Phaser - Physics - Projection
*/

module Phaser.Physics.Projection {

    export class AABBHalf {

        public static Collide(x: number, y: number, obj: Phaser.Physics.AABB, t: Phaser.Physics.TileMapCell) {

            //calculate the projection vector for the half-edge, and then 
            //(if collision is occuring) pick the minimum

            var sx = t.signx;
            var sy = t.signy;

            var ox = (obj.pos.x - (sx * obj.width)) - t.pos.x;//this gives is the coordinates of the innermost
            var oy = (obj.pos.y - (sy * obj.height)) - t.pos.y;//point on the AABB, relative to the tile center

            //we perform operations analogous to the 45deg tile, except we're using 
            //an axis-aligned slope instead of an angled one..

            //if the dotprod of (ox,oy) and (sx,sy) is negative, the corner is in the slope
            //and we need toproject it out by the magnitude of the projection of (ox,oy) onto (sx,sy)
            var dp = (ox * sx) + (oy * sy);
            if (dp < 0)
            {
                //collision; project delta onto slope and use this to displace the object
                sx *= -dp;//(sx,sy) is now the projection vector
                sy *= -dp;

                var lenN = Math.sqrt(sx * sx + sy * sy);
                var lenP = Math.sqrt(x * x + y * y);

                if (lenP < lenN)
                {
                    //project along axis; note that we're assuming that this tile is horizontal OR vertical
                    //relative to the AABB's current tile, and not diagonal OR the current tile.
                    obj.reportCollisionVsWorld(x, y, x / lenP, y / lenP, t);

                    return Phaser.Physics.AABB.COL_AXIS;
                }
                else
                {
                    //note that we could use -= instead of -dp
                    obj.reportCollisionVsWorld(sx, sy, t.signx, t.signy, t);

                    return Phaser.Physics.AABB.COL_OTHER;
                }
            }

            return Phaser.Physics.AABB.COL_NONE;

        }

    }

}