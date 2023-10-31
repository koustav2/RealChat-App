/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signOut as authSignOut } from "firebase/auth";
import { getDoc, doc, setDoc, updateDoc, collection, getDocs } from "firebase/firestore";
import { auth, db, storage } from '../../../firebase'

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const clear = async () => {
        try {
            if (currentUser) {
                await updateDoc(doc(db, "users", currentUser?.uid), {
                    isOnline: false,
                });
            }
            setCurrentUser(null);
            setIsLoading(false);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const authStateChanged = async (user) => {
        setIsLoading(true);

        if (!user) {
            clear();
            return;
        }
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // toast.log(doc.length);
        });
        const userDocRef = doc(db, "users", user.uid);
        let currentUser;

        try {
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                // Add logging to inspect the document data
                // toast.log("User document data:", userDoc.data());

                await updateDoc(doc(db, "users", user.uid), {
                    isOnline: true,
                });

                currentUser = userDoc.data();
            } else {
                // Handle case where document does not exist
                toast.error("User document does not exist.");
            }
        } catch (error) {
            toast.error(error.message);
        }

        // Add logging to debug currentUser value
        // toast.log("CurrentUser:", currentUser);

        setCurrentUser(currentUser);
        setIsLoading(false);
    };


    const signOut = () => {
        authSignOut(auth).then(() => clear());
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, authStateChanged);
        return () => unsubscribe();
    }, []);

    return (
        <UserContext.Provider
            value={{ currentUser, setCurrentUser, isLoading, signOut }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useAuth = () => useContext(UserContext);