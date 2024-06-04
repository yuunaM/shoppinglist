import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faChevronLeft, faXmark, faPen } from "@fortawesome/free-solid-svg-icons";
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc } from "firebase/firestore";
import db from "./config/firebase";

const List = ({ lists, setLists }) => { 
    return (
        <>
        {lists.length === 0 ? (
            <p className='empty_txt'>Let's add list!</p>
        ) : (
            <ul>
                {lists.map((item, index) => (
                    <ListItem key={item.id} itemId={index} item={item} setLists={setLists} />
                ))}
            </ul>
        )}
        </>
    );
}

const ListItem = ({ itemId, item, setLists }) => {
    const [count, setCount] = useState(0);
    const [done, setDone] = useState(false);
    const [docId, setDocId] = useState(null);
    const [listvalue, setListvalue] = useState(item.item);

    useEffect(() => {
        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(db, 'shoppinglist'));
            querySnapshot.forEach((doc) => {
                if (doc.data().item === item.item) {
                    setCount(doc.data().count);
                    setDocId(doc.id); 
                }
            });
        };
        fetchData();
    }, [item]);

    const countUp = async () => {
        setCount(prev => prev + 1);
        await updateCount(item.id, count + 1);
    }

    const countDown = async () => {
        if (count > 0) {
            setCount(prev => prev - 1);
            await updateCount(item.id, count - 1);
        }
    }

    const updateCount = async (itemId, newCount) => {
        await updateDoc(doc(db, 'shoppinglist', itemId), { count: newCount });
    }

    const keyDown = async (e) => {
        if (e.key === 'Enter' && listvalue.trim() !== '') { // 入力エリアが空欄ではなく、Enterが押されたら
            e.preventDefault();
            await updateDoc(doc(db, 'shoppinglist', item.id), { item: listvalue }); // リスト内容が変更されたものと、同一のidを持つデータをshoppinglist dbから探し、更新
            setDone(false); // 編集モード終了
        } 
    }

    const editValue = (e) => {
        setListvalue(e.target.value);
    }

    let listContent;
    if (done) {
        listContent = (
            <input type='text' value={listvalue} onKeyDown={keyDown} onChange={editValue} />
        )
    } else {
        listContent = (
            <span>{listvalue}</span>
        )
    }

    const handleDelete = async () => {
        await deleteDoc(doc(db, 'shoppinglist', item.id)); // 削除されたリストと同一のidを持つデータをdbから削除
        setLists(prevLists => prevLists.filter(listItem => listItem.id !== item.id)); // ブラウザ上からも削除
      }

    return (
        <li>
            <label>
                <input type='checkbox' />
                {listContent}
                {/* <span style={{ textDecoration: done? 'line-through' : 'none' }}>{item}</span> */}
            </label>
            <div className='couner_wrap'>
                <FontAwesomeIcon icon={faPen} onClick={() => { setDone(!done) }} />
                <div className='couner'>
                    <FontAwesomeIcon icon={faChevronLeft} onClick={countDown}/>
                    <span>{count}</span>
                    <FontAwesomeIcon icon={faChevronRight} onClick={countUp} />
                </div>
                <FontAwesomeIcon icon={faXmark} onClick={handleDelete} />
            </div>
        </li>
    )
}

export default List;