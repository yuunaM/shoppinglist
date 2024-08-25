import React, { useState, useEffect } from 'react';
import { onSnapshot, collection } from "firebase/firestore";
import db from '../config/firebase';
import Lottie from 'lottie-react';
import cracker from '../assets/cracker.json'
import Modal from 'react-modal';

Modal.setAppElement('#root');

const Complete = () => {
    const [comp, setComp] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const checkIfAllItemsBought = async () => {
            onSnapshot(collection(db, 'shoppinglist'), (querySnapshot) => {
                const allBought = querySnapshot.docs.every(doc => doc.data().buy === true);
                if (allBought) {
                    setComp(true);
                    setModalOpen(true);
                } else {
                    setComp(false);
                }
            });
        };
        checkIfAllItemsBought();
    }, []);

    const handleClose = () => {
        setModalOpen(false);
    }

    return (
        <>
            {comp && (
                <div className='completeWin' style={{ pointerEvents: 'none' }}>
                    <Lottie animationData={cracker} loop={false} />
                </div >
            )}
        </>
    );
}

export default Complete;