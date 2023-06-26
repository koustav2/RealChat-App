'use client'

import { IoEllipsisVerticalSharp } from "react-icons/io5";
import React, { useState } from "react";
import { useChatContext } from "../context/chatContext";
import Icon from "../Icon ";
import Avatar from "@/app/Avatar";
import ChatMenu from "./ChatMenu";

function ChatHeader(props) {
    const [showMenu, setShowMenu] = useState(false);
    const { users, data } = useChatContext();
    const online = users[data.user.uid]?.isOnline;
    const user = users[data.user.uid];
    return (
        <div className="flex justify-between items-center pb-5 border-b border-white/[0.05]">
            {user && (
                <div className="flex items-center gap-3">
                    <Avatar size="large" user={user} />
                    <div>
                        <div className="font-medium">{user.displayName}</div>
                        <p className="text-sm text-c3">
                            {online ? "Online" : "Offline"}
                        </p>
                    </div>
                </div>
            )}
            <div className="flex items-center gap-2">
                <Icon
                    size="large"
                    className={`${showMenu ? "bg-c1" : ""}`}
                    onClick={() => setShowMenu(true)}
                    icon={
                        <IoEllipsisVerticalSharp
                            size={20}
                            className="text-c3"
                        />
                    }
                />
                {showMenu && (
                    <ChatMenu setShowMenu={setShowMenu} showMenu={showMenu} />
                )}
            </div>
        </div>
    )
}

export default ChatHeader
