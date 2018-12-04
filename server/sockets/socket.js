const { io } = require('../server');
const { TicketControl } = require('../classes/ticket-control');

const ticket = new TicketControl();


io.on('connection', (client) => {

   client.on('siguienteTicket', (data, callback) => {
       let siguiente = ticket.siguiente();
       console.log(siguiente);
       callback(siguiente);           
   });

   // Emitir el evento estadoActual
   client.emit('estadoActual', {
       actual: ticket.getUltimoTicket(),
       ultimos4: ticket.getUltimos4()
   });

   client.on('atenderTicket', (data, callback) => {
       if (!data.escritorio) {
           return callback({
               err: true,
               mensaje: 'El escritorio es necesario'
           })
       }

       let atenderTicket = ticket.atenderTicket(data.escritorio);

       callback(atenderTicket);

       // Actualizar cambios en los últimos 4
       // Emitir los ultimos 4

       client.broadcast.emit('ultimos4', {
           ultimos4: ticket.getUltimos4()
       });
   })
});