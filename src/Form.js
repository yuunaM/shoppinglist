import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import db from "./config/firebase";

const Form = ({ handleAddItem, lists }) => {
    const [value, setValue] = useState('');

    useEffect(() => {
        // shoppinglistコレクションを監視し、対象コレクション全体のデータを第二引数であるsnapshotへ格納
        const unsubscribe = onSnapshot(collection(db, 'shoppinglist'), (snapshot) => {
            snapshot.docChanges().forEach((change) => { // 監視対象のコレクションに変更があればforEachで全体を処理
                if (change.type === 'added') { //変更がadded（追加）タイプであれば処理
                    const newItem = change.doc.data().item; // 対象コレクション内のitemドキュメントをnewItemに代入
                    if (!lists.some(listItem => listItem.id === change.doc.id)) { // 追加されたアイテムが既にリストに存在しない場合
                        handleAddItem({ id: change.doc.id, item: newItem }); // アイテムに id を付与して追加
                    }
                }
            });
        });
        return () => unsubscribe(); // クリーンアップ関数
    }, [handleAddItem, lists]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (value !== '') {
            await addDoc(collection(db, 'shoppinglist'), { // 入力欄が空でなければshoppinglist dbにitemとcountとというデータを追加
                item: value, 
                count: 0 
            });
            setValue(''); // 入力後、フォームを空に
        }
      }

    const onChange = (e) => {
        setValue(e.target.value); // フォームの値が変更されたときにstateを更新
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input type='text' 
                value={value} 
                onChange={onChange}
                placeholder='add your List...'
            />
                <FontAwesomeIcon icon={faPlus} onClick={handleSubmit} className='addBtn' type='submit'/>
            </form>
        </>
    );
}

export default Form;