/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import React from 'react'
import { useEffect } from "react";

import { useAuth } from "@/components/context/authContext";
import { useRouter } from "next/navigation";
import Loader from '@/components/Loder';
function page() {
  const { currentUser, isLoading, signOut } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push("/login");
    }
  }, [currentUser, isLoading, router]);

  return !currentUser ? (
    <Loader />
  ) : (
    <>
      <div className="bg-c1 flex h-[100vh]">
        <div className="flex w-full shrink-0">
          {/* <LeftNav /> */}
          Home
          <button className='h-24 bg-blue-700' onClick={
            signOut
          }>
            signOut
          </button>
          {/* <div className="flex bg-c2 grow">
          <Sidebar />
          {data.user && <Chat />}
        </div> */}
        </div>
      </div>
    </>
  )
}

export default page
