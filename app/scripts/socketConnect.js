import IO from 'socket.io-client';
const io = IO('http://localhost:8080'); //http://localhost:8080

/**
 * Establish a socket.io connection with the server
 * and returns a promise that resolves when a handshake has successfully
 * been made
 * @return promise with initial payload
 */
function connectSocket() {
   return new Promise( ( resolve, reject ) => {
      io.on('connect', socket => resolve( socket ) );
   });
}

/**
 * Connect Socket IO with backend and await the initial payload
 * Setup : //- connetIO().then( ( payload ) => { <-- your code here --> } ) -//
 */
async function connetIO() {
   let initialPayload = await connectSocket();
   return initialPayload;
}

/**
 * exports default object for setup preference
 */
export default {
   connetIO  : connetIO,
   io        : io
}
