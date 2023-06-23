'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from './context/authContext';
import { useChatContext } from './context/chatContext';
import { RiSearch2Line } from "react-icons/ri";
import { db } from '../../firebase';
import { formatDate } from '../utils/helper'
import Avatar from '@/app/Avatar';
import {
    collection,
    doc,
    onSnapshot,
    query,
    Timestamp,
    where,
    getDoc,
    updateDoc,
} from "firebase/firestore";


function Chats() {
    const [search, setSearch] = useState("");
    const [unreadMsgs, setUnreadMsgs] = useState({});

    const isUsersFetchedRef = useRef(false);
    const isBlockExecutedRef = useRef(false);

    const { currentUser } = useAuth();


    const {
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        users,
        setUsers,
        data,
        dispatch,
        resetFooterStates,
    } = useChatContext();

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
            const updatedUsers = {};
            snapshot.forEach((doc) => {
                updatedUsers[doc.id] = doc.data();
                // console.log("updatedUsers", updatedUsers);
            });
            setUsers(updatedUsers);
            if (!isBlockExecutedRef.current) {
                isUsersFetchedRef.current = true;
            }
        });
        return unsubscribe;
    }, [setUsers]);

    return (
        <div className="flex flex-col h-full">
            <div className="shrink-0 sticky -top-[20px] z-10 flex justify-center w-full bg-c2 py-5">
                <RiSearch2Line className="absolute top-9 left-12 text-c3" />
                <input
                    type="Text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search username..."
                    className="w-[300px] h-12 rounded-xl bg-c1/[0.5] pl-11 pr-5 placeholder:text-c3 outline-none text-base"
                />
            </div>
            <ul className="flex flex-col w-full my-5 gap-[2px]">
                {/* {Object.keys(users || {}).length > 0 &&
                    filteredChats?.map((chat) => {
                        const timestamp = new Timestamp(
                            chat[1].date?.seconds,
                            chat[1].date?.nanoseconds
                        );
                        const date = timestamp.toDate();
                        const user = users[chat[1].userInfo.uid];
                        return (
                            <li
                                key={chat[0]}
                                id={chat[0]}
                                onClick={() => handleSelect(user, chat[0])}
                                className={`h-[90px] flex items-center gap-4 rounded-3xl hover:bg-c1 p-4 cursor-pointer ${selectedChat?.uid === user.uid
                                    ? "bg-c1"
                                    : ""
                                    }`}
                            >
                                <Avatar size="x-large" user={user} />
                                <div className="flex flex-col gap-1 grow relative">
                                    <span className="text-base text-white flex  items-center justify-between">
                                        <div className="font-medium">
                                            {user.displayName}
                                        </div>
                                        <div className="text-xs text-c3">
                                            {formatDate(date)}
                                        </div>
                                    </span>
                                    <p className="text-sm text-c3 line-clamp-1">
                                        {chat[1].lastMessage?.text ||
                                            (chat[1].lastMessage?.img &&
                                                "image") ||
                                            "Send first message"}
                                    </p>

                                    {!!unreadMsgs?.[chat[0]]?.length && (
                                        <span className="absolute right-0 top-7 min-w-[20px] h-5 rounded-full bg-red-500 flex justify-center items-center text-sm">
                                            {unreadMsgs?.[chat[0]]?.length}
                                        </span>
                                    )}
                                </div>
                            </li>
                        );
                    })} */}
            </ul>
        </div>
    )
}

export default Chats
