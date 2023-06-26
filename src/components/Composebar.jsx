'use client'


import React from 'react'
import { useChatContext } from './context/chatContext';
import { useAuth } from './context/authContext';
import { v4 as uuid } from "uuid";
import { db, storage } from "../../firebase";
import {
    Timestamp,
    arrayUnion,
    deleteField,
    doc,
    getDoc,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

import { TbSend } from "react-icons/tb";

let typingTimeout = null;

function Composebar() {

    const { currentUser } = useAuth();
    const {
        inputText,
        setInputText,
        attachment,
        setAttachment,
        setAttachmentPreview,
        data,
        editMsg,
        setEditMsg,
    } = useChatContext();


    const handleTyping = async (e) => {
        setInputText(e.target.value);
        await updateDoc(doc(db, "chats", data.chatId), {
            [`typing.${currentUser.uid}`]: true,
        });

        // If the user was previously typing, clear the timeout
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        // Set a new timeout for 1.5 seconds after the last keystroke
        typingTimeout = setTimeout(async () => {
            // Send a typing indicator to other users indicating that this user has stopped typing


            await updateDoc(doc(db, "chats", data.chatId), {
                [`typing.${currentUser.uid}`]: false,
            });

            // Reset the timeout
            typingTimeout = null;
        }, 500);
    }
    const handleSend = async () => {
        if (attachment) {
            const storageRef = ref(storage, uuid());
            const uploadTask = uploadBytesResumable(storageRef, attachment);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    // Observe state change events such as progress, pause, and resume
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    // console.log("Upload is " + progress + "% done");
                    switch (snapshot.state) {
                        case "paused":
                            // console.log("Upload is paused");
                            break;
                        case "running":
                            // console.log("Upload is running");
                            break;
                    }
                },
                (error) => {
                    console.error(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(
                        async (downloadURL) => {
                            await updateDoc(doc(db, "chats", data.chatId), {
                                messages: arrayUnion({
                                    id: uuid(),
                                    text: inputText,
                                    sender: currentUser.uid,
                                    date: Timestamp.now(),
                                    img: downloadURL,
                                    read: false,
                                }),
                            });
                        }
                    );
                }
            );
        } else {
            await updateDoc(doc(db, "chats", data.chatId), {
                messages: arrayUnion({
                    id: uuid(),
                    text: inputText,
                    sender: currentUser.uid,
                    date: Timestamp.now(),
                    read: false,
                }),
            });
        }

        let msg = { text: inputText };
        if (attachment) {
            msg.img = true;
        }

        await updateDoc(doc(db, "userChats", currentUser.uid), {
            [data.chatId + ".lastMessage"]: msg,
            [data.chatId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", data.user.uid), {
            [data.chatId + ".lastMessage"]: msg,
            [data.chatId + ".date"]: serverTimestamp(),
            [data.chatId + ".chatDeleted"]: deleteField(),
        });

        setInputText("");
        setAttachment(null);
        setAttachmentPreview(null);

    }

    const handleEdit = async () => {
        try {
            const _ID = editMsg.id;
            const chatRef = doc(db, "chats", data.chatId);

            // Retrieve the chat document from Firestore
            const chatDoc = await getDoc(chatRef);

            if (attachment) {
                const storageRef = ref(storage, uuid());
                const uploadTask = uploadBytesResumable(storageRef, attachment);

                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        // Observe state change events such as progress, pause, and resume
                        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                        const progress =
                            (snapshot.bytesTransferred / snapshot.totalBytes) *
                            100;
                        console.log("Upload is " + progress + "% done");
                        switch (snapshot.state) {
                            case "paused":
                                console.log("Upload is paused");
                                break;
                            case "running":
                                console.log("Upload is running");
                                break;
                        }
                    },
                    (error) => {
                        console.error(error);
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then(
                            async (downloadURL) => {
                                // Create a new "messages" array that excludes the message with the matching ID
                                let updatedMessages = chatDoc
                                    .data()
                                    .messages.map((message) => {
                                        if (message.id === _ID) {
                                            message.text = inputText;
                                            message.img = downloadURL;
                                        }
                                        return message;
                                    });

                                await updateDoc(chatRef, {
                                    messages: updatedMessages,
                                });
                            }
                        );
                    }
                );
            } else {
                // Create a new "messages" array that excludes the message with the matching ID
                let updatedMessages = chatDoc.data().messages.map((message) => {
                    if (message.id === _ID) {
                        message.text = inputText;
                    }
                    return message;
                });
                await updateDoc(chatRef, { messages: updatedMessages });
            }

            setInputText("");
            setAttachment(null);
            setAttachmentPreview(null);
            setEditMsg(null);
        } catch (err) {
            console.error(err);
        }
    }

    const onKeyUp = (e) => {
        if (e.key === "Enter" && (inputText || attachment)) {
            if (editMsg) {
                handleEdit();
            } else {
                handleSend();
            }
        }
    }


    return (
        <div className="flex items-center gap-2 grow">
            <input
                type="text"
                className="grow w-full outline-0 px-2 py-2 text-white bg-transparent placeholder:text-c3 outline-none text-base"
                placeholder="Type a message"
                value={inputText}
                onChange={handleTyping}
                onKeyUp={onKeyUp}
            />
            <button
                onClick={!editMsg ? handleSend : handleEdit}
                className={`h-10 w-10 rounded-xl shrink-0 flex justify-center items-center ${inputText.trim().length > 0 ? "bg-c4" : ""
                    }`}
            >
                <TbSend size={20} className="text-white" />
            </button>
        </div>
    )
}

export default Composebar
