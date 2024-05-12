import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc } from "firebase/firestore";
import db from "./config/firebase";

const Form = ({ handleAddItem, lists }) => {
    const [value, setValue] = useState('');

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'shoppinglist'), (snapshot) => {
            snapshot.docChanges().forEach((change) => { // コレクションを監視し、変更があれば処理
                if (change.type === 'added') {
                    const newItem = change.doc.data().item;
                    // newItemが既にリストに存在しない場合のみ追加する
                    if (!lists.includes(newItem)) {
                        handleAddItem(newItem);
                    }
                }
            });
        });
        
        return () => unsubscribe();
    }, [handleAddItem, lists]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (value !== '') {
            await addDoc(collection(db, 'shoppinglist'), { item: value, count: 0 });
            handleAddItem(value); // ①フォームの値をApp.jsに渡す
            setValue(''); //入力後、フォームを空に
        }
    }

    const onChange = (e) => {
        setValue(e.target.value); // フォームの値が変更されたときにstateを更新
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type='text' 
              value={value} 
              onChange={onChange}
              placeholder='add your List...'
            />
            <button className='addBtn' type='submit'>＋</button>
        </form>
    );
}

export default Form;