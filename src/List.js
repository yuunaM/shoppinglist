import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faChevronLeft, faXmark, faPen } from "@fortawesome/free-solid-svg-icons";
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc, onSnapshot } from "firebase/firestore";
import db from "./config/firebase";

const List = ({ lists, setLists }) => { 
    return (
        <>
            {lists.length === 0 ? (
                <p className='empty_txt'>Let's add list!</p>
            ) : (
                <ul>
                    {lists.map((item) => ( // item = lists。 lists内にはitem、countプロパティが含まれている
                        <ListItem key={item.id} item={item} setLists={setLists} />
                    ))}
                </ul>
            )}
        </>
    );
}

const ListItem = ({ item, setLists }) => {
    const [count, setCount] = useState(item.count); // 親からもったlist内のcountプロパティを初期値に設定
    const [done, setDone] = useState(false);
    const [buy, setBuy] = useState(false);
    const [listvalue, setListvalue] = useState(item.item); // 親からもったlist内のitemプロパティを初期値に設定

    // アイテム個数
    const countUp = async () => {
        const newCount = count + 1;
        setCount(newCount);
        await updateDoc(doc(db, 'shoppinglist', item.id), { count: newCount });
    }

    const countDown = async () => {
        if (count > 0) {
            const newCount = count - 1;
            setCount(newCount);
            await updateDoc(doc(db, 'shoppinglist', item.id), { count: newCount });
        }
    }

    // dbのアイテム数が変更されたらローカルも更新
    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, 'shoppinglist', item.id), (docSnapshot) => {
            if (docSnapshot.exists()) {
                setCount(docSnapshot.data().count);
            }
        });
        return () => unsubscribe();
    }, [count]);

    // リストの再編集
    const keyDown = async (e) => {
        if (e.key === 'Enter' && listvalue.trim() !== '') { // 入力エリアが空欄ではなく、Enterが押されたら
            e.preventDefault();
            await updateDoc(doc(db, 'shoppinglist', item.id), { item: listvalue }); // リスト内容が変更されたものと、同一のidを持つデータをshoppinglist dbから探して更新
            setDone(false);
        } 
    }

    // リスト再編集後のstate更新
    useEffect(() => {
        onSnapshot(doc(db, 'shoppinglist', item.id), (docSnapshot) => { // 変更対象のitem.idと同じドキュメントをdocSnapshotに渡す
            if (docSnapshot.exists()) { // docSnapshotと同じデータがdbにあれば
                setListvalue(docSnapshot.data().item); // そのitem名でsetListvalueを更新
            } 
        });
    }, [item.id])

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
            <span style={{ textDecoration: buy? 'line-through' : 'none' }}>{listvalue}</span>
        )
    }

    // リストの削除
    const handleDelete = async () => {
        await deleteDoc(doc(db, 'shoppinglist', item.id)); 
    }

    useEffect(() => {
        const unsub = onSnapshot(doc(db, 'shoppinglist', item.id), (docSnapshot) => {
            if (!docSnapshot.exists()) {
                setLists(prevLists => prevLists.filter(listItem => listItem.id !== item.id));
            }
        });
        return () => unsub();
    }, [item.id]);


    return (
        <li>
            <label>
                <input type='checkbox'onClick={() => setBuy(!buy)} />
                {listContent}
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