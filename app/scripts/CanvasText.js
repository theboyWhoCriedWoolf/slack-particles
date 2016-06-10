/**
 * Canvas text class
 * @param {object} opts
 */
export default function CanvasText( opts ) {
    // assign with defaults
    opts = Object.assign( this, {
        el          : 'wordCanvas',
        lineHeight  : 4,
        typeface    : 'arial',
        fontSize    : 200,
        debug       : false
    }, opts)

    this.canvas = document.getElementsByClassName(opts.el)[0];
    this.ctx    = this.canvas.getContext('2d');

    this.canvas.width       = opts.width;
    this.canvas.height      = opts.height;
    // this.lineHeight         = opts.lineHeight;

    if(opts.debug === true) {
        this.canvas.style.display = 'block';
        this.canvas.style.zIndex  = 300;
    }
};


/**
 * extend prototype
 * @type {Object}
 */
CanvasText.prototype = {

    /**
     * draw text
     * @param  {string} str
     * @return {promise}
     */
    drawText( str ) {
        return new Promise( ( resolve, reject )=> {
            this.currentString = str;

            let result       = [],
                ctx          = this.ctx,
                lineHeight   = this.lineHeight,
                canvasWidth  = this.canvas.width,
                canvasHeight = this.canvas.height;


            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            drawText( ctx, str, canvasWidth, canvasHeight, this );
            result = pixelsByGrid( ctx, canvasWidth, canvasHeight, lineHeight);
            resolve( result );

        });
    },

    resize( width, height ) {
        this.canvas.width  = width;
        this.canvas.height = height;
    }
}


/**
 * pixelByLine - loops through and calculates pixels by row
 * @param  {ctx} ctx
 * @param  {int} canvasWidth
 * @param  {int} canvasHeight
 * @param  {int} lineHeight
 * @param  {boolean} debug
 * @return {array}
 */
function pixelByLine(ctx, canvasWidth, canvasHeight, lineHeight, debug = true) {
    let totalLines_x = Math.floor(canvasWidth/lineHeight),
        result       = [],
        points       = [],
        row,
        dataX,
        pixel;

    for(let x = 0; x < totalLines_x; ++x) {
        dataX  = ctx.getImageData(x * lineHeight, 0 , 1, canvasHeight).data;
        points[points.length] = getParticlePositions( dataX, x * lineHeight);
    }

    for(let i = 1; i < points.length; ++i) {
   		row = getDrawPoints(points[i])
         for(var j = 0; j < row.length; ++j) {
             result[ result.length ] = { x : row[j].x, y : row[j].y }
             if(debug) {
                 point(ctx, row[j].x, row[j].y );
             }
   		}
    }

    return result;
}


/**
 * creates an array of pixels using a grid approach
 *  - switches between both implementations to create a different effect
 * @param  {ctx} ctx
 * @param  {int} canvasWidth
 * @param  {int} canvasHeight
 * @param  {int} lineHeight
 * @param  {boolean} debug
 * @return {array}
 */
function pixelsByGrid( ctx, canvasWidth, canvasHeight, lineHeight, debug = true ) {
    let imageData   = ctx.getImageData( 0, 0, canvasWidth, canvasHeight ),
        image_Data  = imageData.data,
        result      = [],
        pixel;


    for( let width = 0; width < canvasWidth; width += lineHeight ) {
        for( let height = 0; height < canvasHeight; height += lineHeight ) {
            pixel = image_Data[ ( ( width + ( height * canvasWidth ) ) * 4 ) - 1 ];
            if(pixel == 255) {
                let position = {
                    x		: width,
                    y		: height
                }
                result.push(position);
                if(debug) {
                    point(ctx, position.x, position.y);
                }
            }
        }
    }
    return result;
}

/**
 * point
 * @return {object}
 */
function point( ctx, x, y) {
    ctx.beginPath();
    ctx.arc( x, y, 1, 0, Math.PI*2 );
    ctx.fillStyle = 'white';
    ctx.fill();
}


/**
 * calculate particle position
 * @return {array}
 */
function getParticlePositions(data, x, y) {
  var row = [];
  var pos;

  for(var i = 3; i < data.length; i += 4) {
    if(data[i] !== 0) {
        pos = i / 4;
        row[row.length] = {
            x: x || pos,
            y: y || pos
        };
    }
  }
  return row;
}


/**
 * creates draw points
 * @param  {array} rowPoints
 * @return {array}
 */
function getDrawPoints( rowPoints ) {
  var row = [];
  var startX, startY, x, y, isColumn, startingPoint = {}, endPoint = {};

  for(var i = 0; i < rowPoints.length; ++i ) {
      x        = rowPoints[i].x;
      y        = rowPoints[i].y;

      row[row.length] = {
        x : x,
        y : y
      }
  }
  return row
}


/**
 * Splits the text into different lines based on available
 * width
 * @param  {ctx} context
 * @param  {string} text
 * @param  {int} maxWidth
 * @return {array}
 */
function splitText(context, text, maxWidth) {
    var words = text.split(' ');
    var line = '';
    var startingIndex = 0;
    var result = [];

    for(var n = 0; n < words.length; n++) {
        line += words[n] + ' ';
        let metrics = context.measureText(line);
        if(metrics.width >= maxWidth ) {
            result.push( line );
            line = '';
        }
    }

    if(line){ result.push( line ); }
    return result;
}

/**
 * resizes text to fit the canvaswidth and height using a 50pt margin
 * @param  {ctx} context
 * @param  {array} textArray - sttring array
 * @param  {int} fontSize
 * @param  {int} cw
 * @param  {int} ch
 * @return {int} font size
 */
function resizeToFit( ...opts ) {

      let [ cnvsContext, textArray, cw, ch, context] = opts,
          wordWidth = 0,
          fontSize  = context.fontSize,
          typeface  = context.typeface,
          padding   = 100;
      do
      {
        wordWidth = 0;
        fontSize -= 5;
        cnvsContext.font=`${fontSize}px ${typeface}`;

        for(var i=0;i<textArray.length;i++) {
          var w=cnvsContext.measureText(textArray[i]).width;
          if(w>wordWidth) wordWidth=w;
        }

    } while(wordWidth > (cw-padding) || (fontSize * textArray.length) > (ch-padding) );

      return fontSize;
}

/**
 * draw the text
 * after calculating its size and lines
 * @param  {ctx} context
 * @param  {string} textStr
 * @param  {int} fontSize=200
 * @param  {int} cw=window.innerWidth
 * @param  {int} ch=window.innerHeight
 */
function drawText( cnvsContext, textStr, cw=window.innerWidth, ch=window.innerHeight, context ) {

    cnvsContext.font          = `${context.fontSize}px ${context.typeface}`;
    cnvsContext.clearRect(0, 0, cw, ch);
    cnvsContext.textAlign     = "center";
    cnvsContext.textBaseline  = "middle";
    cnvsContext.fillStyle     = 'black';

    let textArray     = splitText(cnvsContext, textStr, cw-50);
    let fs            = resizeToFit(cnvsContext, textArray, cw, ch, context);

    for(let i = 0; i < textArray.length; i++) {
        cnvsContext.fillText(textArray[i], (cw/2 + 10),  ch/2 - fs*(textArray.length/2-(i+0.5)));
    }
}
