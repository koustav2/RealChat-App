/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import React from 'react'
import { useEffect } from "react";

import { useAuth } from "@/components/context/authContext";
import { useRouter } from "next/navigation";
import Loader from '@/components/Loder';
import { useChatContext } from '@/components/context/chatContext';
import SideBar from '@/components/SideBar';
import LeftNav from '@/components/LeftNav';
import Chat from '@/components/chat/Chat';
function page() {

  const { currentUser, isLoading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push("/login");
    }
  }, [currentUser, isLoading, router]);
  const { data } = useChatContext();

  return !currentUser ? (
    <Loader />
  ) : (
    <>
      <div className="bg-c6 flex h-[100vh]">
        <div className="flex w-full shrink-0">
          <LeftNav />
          <div className="flex bg-c2 grow">
          <SideBar />
          {data.user && <Chat />}
        </div>
        </div>
      </div>
    </>
  )
}

export default page
