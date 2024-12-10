import { io } from "./server.js"
const handlePrepareDoc = (socket) => {
    io.on("prepare-doc", (data) => {
        console.log(data);
    })
}
export {
    handlePrepareDoc
}