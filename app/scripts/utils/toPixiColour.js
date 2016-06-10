
/**
 * //toPixiColour
 * convert hex to pixi colour format
 * @return {string}
 */
export default function( hexStr ) {
    return hexStr.replace('#', '0x');
}
