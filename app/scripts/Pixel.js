import randRange from 'utils/randRange';
import perlin    from 'utils/perlin.js';
import map       from 'utils/map.js';

// create perlin noise
const noise = perlin( {} );

/**
 * Pixel class
 */
export default function Pixel( _radius, _position, _fixed, _bounds ) {
    this.bounds         = _bounds;
    this.radius         = _radius;

    this.pos            = {x:_position.x , y:_position.y};
    this.startPos       = {x:0, y:0};
    this.accel          = {x:0,y:0};
    this.speed          = {x:0, y:0};
    this.noise          = {x:0, y:0};

    this.fixedpos       = _fixed;
    this.scale          = 1;
    this._scale         = new PIXI.Point(0,0);
    this.alive          = true;
    this.canDraw        = true;
    this.numLines       = 0;
    this.alpha          = 1;
    this.hasLine        = false;

    this.noise1 = {x:randRange(-100,100)/ 1000.0, y:randRange(-100,100)/ 1000.0};
    this.noise2 = {x:randRange(-100,100)/ 1000.0, y:randRange(-100,100)/ 1000.0};

    this.num1 = randRange(0,100) / 1000.0;
    this.num2 = randRange(0,100) / 1000.0;
    this.dump = randRange(80,120) / 500.0;
}


/**
 * extend Pixel class prototype
 * @type {Object}
 */
Pixel.prototype = {

    // set tint
    setTint( col ) {
        this.graphics.tint = col
    },

    /**
     * draw the pixel graphic from texture
     */
    draw( src ) {
        this.graphics = new PIXI.Sprite.fromImage(src);
        this.graphics.anchor.set(0.5);
        return this.graphics;
    },

    /**
     * move the particle
     */
    move() {

        if(this.fixedPos) {
            this.moveToOrigin();
        } else {
			this.addNoise();
        }

        this.speed.x += this.accel.x;
		this.speed.y += this.accel.y;

		this.pos.x += this.speed.x;
		this.pos.y += this.speed.y;

		this.speed.x *= 0.98;
		this.speed.y *= 0.98;

		this.accel.x = 0;
		this.accel.y = 0;

		this.noise1.x += this.num1;
		this.noise2.y += this.num2;

		this.noise2.x += this.num1;
		this.noise2.y += this.num2;

        if(!this.canDraw) {
            this.scale -= this.scale * 0.02;
        } else {
            this.scale += (0.2 - this.scale) * 0.2;
        }

        this._scale.set(this.scale, this.scale);
        this._checkLife();

        this.graphics.visible = this.alive;
        this.graphics.alpha   = this.alpha;

    },

    /**
     * check the particle life
     */
    _checkLife() {
        if( this.scale <= 0.01 ) { this.alive = false }

        if(this.pos.x < 0 ) {
            this.alive = false;
        }
        if(this.pos.x > window.innerWidth) {
            this.alive = false;
        }
    },

    /**
     * move to a designated origin
     */
    moveToOrigin() {
        var dx = (this.startPos.x - this.pos.x);
		var dy = (this.startPos.y - this.pos.y);

		this.pos.x += dx * 0.2;
		this.pos.y += dy * 0.2;

        var d = Math.sqrt(dx * dx + dy * dy)

		if(d > 100)
			this.addNoise();
    },

    /**
     * add noise to movement
     */
    addNoise() {
        var n1 = noise.perlin2(this.noise1.x , this.noise1.y);
		var n2 = noise.perlin2(this.noise2.x , this.noise2.y);

        n1 = map(n1 , -1,1,-100,100) * 0.0005;
		n2 = map(n2 , -1,1,-100,100) * 0.0005;

		this.addForce({x:n1 , y:n2});
    },

    /**
     * add force to movement
     */
    addForce(f) {
		this.accel.x += f.x;
		this.accel.y += f.y;
	},

    /**
     * update particle movement
     */
    update() {
        this.graphics.position.x = this.pos.x;
        this.graphics.position.y = this.pos.y;
        this.graphics.scale      = this._scale;
    }

}
