# Socket IO Interface Reference for Client Side

## (Non-Angular) Client Side Example:
socket.emit('Logged In', userdata);
socket.emit('Logged Out', userdata);
socket.emit('Public Message', messagedata);

socket.on('Online', function(usrdata){DO STUFF});
socket.on('Offline, function(usrdata){DO STUFF});
socket.on('ERROR: Failed to Save Public Message', );
