import React from 'react'
import Chats from './Chats';

function SideBar() {
  return (
    <div className="w-[400px] p-5 overflow-auto scrollbar shrink-0 border-r border-blue-900/[1.0]">
      <div className="flex flex-col h-full">
        <Chats />
      </div>
    </div>
  );
}

export default SideBar
