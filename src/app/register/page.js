/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import React, { useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signInWithRedirect
} from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { IoLogoGoogle, IoLogoFacebook } from "react-icons/io";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { doc, setDoc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import ToastMessage from '@/components/ToastMessage';
import { auth, db, storage } from '../../../firebase'
import { useAuth } from '@/components/context/authContext';
import { profileColors } from '../../utils/constants';
import Loader from '@/components/Loder';

const gProvider = new GoogleAuthProvider();
const fProvider = new FacebookAuthProvider();

function page() {
  const router = useRouter();
  const { currentUser, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && currentUser) {
      router.push("/login");
    }
  }, [currentUser, isLoading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3]?.files?.[0];
    const colorIndex = Math.floor(Math.random() * profileColors.length);

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // toast.log(user);

      if (file) {
        const storageRef = ref(storage, displayName);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) *
              100;
            toast.info("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                toast.info("Upload is paused");
                break;
              case "running":
                toast.info("Upload is running");
                break;
            }
          },
          (error) => {
            toast.error(error.message);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                await updateProfile(user, {
                  displayName,
                  photoURL: downloadURL,
                });
                toast.log("File available at", downloadURL);

                await setDoc(doc(db, "users", user.uid), {
                  uid: user.uid,
                  displayName,
                  email,
                  photoURL: downloadURL,
                  color: profileColors[colorIndex],
                });

                await setDoc(
                  doc(db, "userChats", user.uid),
                  {}
                );

                router.push("/");
              }
            );
          }
        );
      } else {
        await updateProfile(user, {
          displayName,
        });
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          displayName,
          email,
          color: profileColors[colorIndex],
        });
        await setDoc(doc(db, "userChats", user.uid), {});
        router.push("/");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithRedirect(auth, gProvider);
    } catch (error) {
      toast.error("An error occured", error.message);
    }
  };

  const signInWithFacebook = async () => {
    try {
      await signInWithRedirect(auth, fProvider);
    } catch (error) {
      toast.error("An error occured", error.message);
    }
  };

  return isLoading || (!isLoading && !!currentUser) ? (
    <Loader />
  ) : (
    <div className="h-[100vh] flex justify-center items-center bg-c1">
      {/* <ToastMessage /> */}
      <div className="flex items-center flex-col">
        <div className="text-center">
          <div className="text-4xl font-bold">Create New Account</div>
          <div className="mt-3 text-c3">
            Connect and chat with anyone, anywhere
          </div>
        </div>
        {/* <div className="flex items-center gap-2 w-full mt-10 mb-5">
          <div
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-1/2 h-14 rounded-md cursor-pointer p-[1px]"
          onClick={signInWithGoogle}
          >
            <div className="flex items-center justify-center gap-3 text-white font-semibold bg-c1 w-full h-full rounded-md">
              <IoLogoGoogle size={24} />
              <span>Login with Google</span>
            </div>
          </div>
          <div
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-1/2 h-14 rounded-md cursor-pointer p-[1px]"
          onClick={signInWithFacebook}
          >
            <div className="flex items-center justify-center gap-3 text-white font-semibold bg-c1 w-full h-full rounded-md">
              <IoLogoFacebook size={24} />
              <span>Login with Facebook</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-5 h-[1px] bg-c3"></span>
          <span className="text-c3 font-semibold">OR</span>
          <span className="w-5 h-[1px] bg-c3"></span>
        </div> */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-3 w-[500px] mt-5"
        >
          <input
            type="text"
            placeholder="Display Name"
            className="w-full h-14 bg-c5 rounded-xl outline-none border-none px-5 text-c3"
            autoComplete="off"
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full h-14 bg-c5 rounded-xl outline-none border-none px-5 text-c3"
            autoComplete="off"
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full h-14 bg-c5 rounded-xl outline-none border-none px-5 text-c3"
            autoComplete="off"
            required
          />
          {/* <input type="file" /> */}
          <button className="mt-4 w-full h-14 rounded-xl outline-none text-base font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
            {isLoading ? (
              <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full border-2 border-t-2 border-gray-200 animate-spin"></div>
              </div>
            ) : null}
            Sign Up
          </button>

        </form>
        <div className="flex justify-center gap-1 text-c3 mt-5">
          <span>Already have an account?</span>
          <Link
            href="/login"
            className="font-semibold text-white underline underline-offset-2 cursor-pointer"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default page
