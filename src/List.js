import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faChevronLeft, faXmark } from "@fortawesome/free-solid-svg-icons";
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc } from "firebase/firestore";
import db from "./config/firebase";

const List = ({ lists, setLists }) => {
    return (
        <ul>
            {lists.map((item, index) => (
                <ListItem key={index} itemId={index} item={item} setLists={setLists} />
            ))}
        </ul>
    );
}

const ListItem = ({ itemId, item, setLists }) => {
    const [count, setCount] = useState(0);
    const [done, setDone] = useState(false);
    const [docId, setDocId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(db, 'shoppinglist'));
            querySnapshot.forEach((doc) => {
                if (doc.data().item === item) {
                    setCount(doc.data().count);
                    setDocId(doc.id); // ドキュメント ID をセット
                }
            });
        };
        fetchData();
    }, [item]);

    const countUp = async () => {
        setCount(prev => prev + 1);
        await updateCount(docId, count + 1);
    }

    const countDown = async () => {
        if (count > 0) {
            setCount(prev => prev - 1);
            await updateCount(docId, count - 1);
        }
    }

    const handlekDelete = async () => {
        const querySnapshot = await getDocs(collection(db, 'shoppinglist')); // データベースのSnapshotを取得
        querySnapshot.forEach((doc) => { // Snapshotのデータ内でループ処理
            const data = doc.data();
            if (data.item === item) { // データベースから取得したデータとListアイテムを比較、一致するものを削除
                deleteDoc(doc.ref).then(() => { // 該当のデータが削除されたら
                    setLists(prevLists => prevLists.filter(listItem => listItem !== item)); // コンポーネント内の該当itemも削除
                })
            }
        });
    }

    const updateCount = async (itemId, newCount) => {
        const docRef = doc(db, 'shoppinglist', itemId);
        await updateDoc(docRef, { count: newCount });
    }

    return (
        <li>
            <label onChange={() => { setDone(!done) }}>
                <input type='checkbox' />
                <span style={{ textDecoration: done? 'line-through' : 'none' }}>{item}</span>
            </label>
            <div className='couner_wrap'>
                <div className='couner'>
                    <FontAwesomeIcon icon={faChevronLeft} onClick={countDown}/>
                    <span>{count}</span>
                    <FontAwesomeIcon icon={faChevronRight} onClick={countUp} />
                </div>
                <FontAwesomeIcon icon={faXmark} onClick={handlekDelete}/>
            </div>
        </li>
    )
}

export default List;