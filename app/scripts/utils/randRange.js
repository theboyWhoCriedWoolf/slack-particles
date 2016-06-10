/**
 * random range between two numbers
 * @param  {number} min
 * @param  {number} max
 * @return {number} 
 */
export default function(min, max) {
    return Math.random() * (max - min) + min;
}
