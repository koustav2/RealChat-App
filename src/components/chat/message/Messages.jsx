'use client'
import React, {  useEffect, useState, useRef } from 'react'
import Message from './Message'
import { useChatContext } from '@/components/context/chatContext';
import { useAuth } from '@/components/context/authContext';
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { db } from '../../../../firebase';
import { DELETED_FOR_ME } from '@/utils/constants';
function Messages() {
    const [messages, setMessages] = useState([]);
    const { data, setIsTyping } = useChatContext();
    const { currentUser } = useAuth();
    const ref = useRef();

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
            if (doc.exists()) {
                setMessages(doc.data().messages);
                setIsTyping(doc.data()?.typing?.[data.user.uid] || false);
            }
            setTimeout(() => {
                scrollToBottom();
            }, 0);
        });
        return () => unsubscribe();
    }, [data.chatId, data.user.uid, setIsTyping]);

    const scrollToBottom = () => {
        const chatContainer = ref.current;
        chatContainer.scrollTop = chatContainer.scrollHeight;
    };



    // console.log(messages);

    return (
        <div
            ref={ref}
            className="grow p-5 overflow-auto scrollbar flex flex-col"
        >
            {messages
                ?.filter(
                    (m) =>
                        m?.deletedInfo?.[currentUser.uid] !== DELETED_FOR_ME &&
                        !m?.deletedInfo?.deletedForEveryone &&
                        !m?.deleteChatInfo?.[currentUser.uid]
                )
                ?.map((m) => {
                    return <Message message={m} key={m.id} />;
                })}
        </div>
    );
}

export default Messages
