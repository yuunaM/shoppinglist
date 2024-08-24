import React, { useState, useEffect } from 'react';
import { onSnapshot, collection } from "firebase/firestore";
import db from '../config/firebase';
import Lottie from 'lottie-react';
import cracker from '../assets/cracker.json'


const Complete = () => {
    const [comp, setComp] = useState(false);

    useEffect(() => {
        const checkIfAllItemsBought = async () => {
            onSnapshot(collection(db, 'shoppinglist'), (querySnapshot) => {
                const allBought = querySnapshot.docs.every(doc => doc.data().buy === true);
                if (allBought) {
                    setComp(true);
                } else {
                    setComp(false);
                }
            });
        };
        checkIfAllItemsBought();
    }, []);

    return (
        <>
            {comp && (
                <div className='completeWin' >
                    <Lottie animationData={cracker} loop={false} />
                </div >
            )}
        </>
    );
}

export default Complete;