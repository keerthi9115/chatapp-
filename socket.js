const users = [];

const onSocket = (io) => {
	io.on("connection", (socket) => {
		socket.on("user:join", (name) => {
			!users.some((user) => user.name === name) &&
				users.push({ name, sockeId: socket.id });
			io.emit("global:message", `${name} just joined !`);
		});

		socket.on("message:send", (payload) => {
			socket.broadcast.emit("message:receive", payload);
		});

		socket.on("disconnect", () => {
			const user = users.filter((user) => user.sockeId === socket.id);
			if (user[0] && user[0].name) {
				io.emit("global:message", `${user[0].name} just left !`);
			} else {
				io.emit("global:message", `A user just left !`);
			}
		});
	});
};

export default onSocket;
