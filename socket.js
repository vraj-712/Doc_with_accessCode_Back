import { Document } from "./model/documet.model.js";
import { io } from "./server.js";

io.on("connection", async (socket) => {
   const document_id = socket.handshake.query.doc_id;

    socket.on("prepare-doc", async (doc_id) => {
        socket.join(doc_id);
        const docData = await fetchDocData(doc_id);
        socket.emit("load-doc", docData.data);    
    })

    socket.on('send-changes', (data) => {
        socket.broadcast.to(data.doc_id).emit('receive-changes', data.delta)
    })

    socket.on('save-changes',async (data) => {
        const doc = await Document.findOne({doc_id:data?.doc_id})
        doc.data = data?.delta
        await doc.save();
    })

    socket.on('inc-user-count', async (doc_id) => {
        socket.join(doc_id);
        const doc = await Document.findOne({doc_id: doc_id});
        doc.total_users++;
        await doc.save().then((res) => {
            console.log(res.total_users);
            io.to(doc_id).emit('display-user-count', doc.total_users) 
        }).catch((err) => {
            console.log(err);
        })
    })

    socket.on("disconnect", async () => { // Store `doc_id` when user joins a room
        const doc_id = document_id;
        console.log(doc_id);
        if (doc_id) {
            const doc = await Document.findOne({ doc_id: doc_id });
            if (doc) {
                doc.total_users = Math.max(0, doc.total_users - 1); // Avoid negative counts
                await doc.save();
                console.log(`Updated user count for doc_id ${doc_id}: ${doc.total_users}`);
                
                // Notify remaining users in the room
                socket.broadcast.to(doc_id).emit('display-user-count', doc.total_users);
            }
        }
        console.log("user disconnected");
    });
});

const fetchDocData = async (doc_id) => {
    const docData = await Document.findOne({doc_id: doc_id}).select("-access_code");
    return docData;   
}