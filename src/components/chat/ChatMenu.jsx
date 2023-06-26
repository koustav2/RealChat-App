'use client'

import React from 'react'
import { useAuth } from '../context/authContext';
import { useChatContext } from '../context/chatContext';
import { db } from '../../../firebase'
import {
    arrayRemove,
    arrayUnion,
    doc,
    getDoc,
    updateDoc,
} from "firebase/firestore";
import ClickAwayListener from "react-click-away-listener";

function ChatMenu({ setShowMenu, showMenu }) {
    const { data, users, dispatch, chats, setSelectedChat } = useChatContext();
    const { currentUser } = useAuth();

    const isUserBlocked = users[currentUser.uid]?.blockedUsers?.find(
        (u) => u === data.user.uid
    );

    const IamBlocked = users[data.user.uid]?.blockedUsers?.find(
        (u) => u === currentUser.uid
    );

    const handleClickAway = () => {
        setShowMenu(false);
    };

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <div
                className={`w-[200px] absolute top-[70px] right-5 bg-c0 z-10 rounded-md overflow-hidden`}
            >
                <ul className="flex flex-col py-2">
                    {!IamBlocked && (
                        <li
                            className="flex items-center py-3 px-5 rounded-sm hover:bg-yellow-500 cursor-pointer"
                        // onClick={(e) => {
                        //     e.stopPropagation();
                        //     handleBlock(
                        //         isUserBlocked ? "unblock" : "block"
                        //     );
                        // }}
                        >
                            {isUserBlocked ? "Unblock" : "Block user"}
                        </li>
                    )}
                    <li
                        className="flex items-center py-3 px-5 rounded-sm hover:bg-yellow-500 cursor-pointer"
                    // onClick={(e) => {
                    //     e.stopPropagation();
                    //     setShowMenu(false);
                    //     handleDelete();
                    // }}
                    >
                        Delete chat
                    </li>
                </ul>
            </div>
        </ClickAwayListener>
    )
}

export default ChatMenu
