import React, { useState } from 'react';
import { collection, getDocs, doc, writeBatch, deleteDoc } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Form from './Form';
import List from './List';
import './App.css';
import db from "./config/firebase";

function App() {
  const [lists, setLists] = useState([]);

  const handleAddItem = (value) => {
    setLists([...lists, value]) // ②Formコンポーネントから受け取ったvalueをリストに新しく追加
  }

  const allDelete = async () => {
    const querySnapshot = await getDocs(collection(db, 'shoppinglist'));
    querySnapshot.forEach(async (docSnapshot) => {
      await deleteDoc(doc(db, 'shoppinglist', docSnapshot.id));  // docSnapshot.id（db内のデータに付与されている一意のid）と一致しているものを削除
    });
    setLists([]); // 配列を空状態に更新
  }

  return (
    <div className='wrap'>
      <p className='emoji'>📎</p>
      <h1>Happy Shopping</h1>
      <Form handleAddItem={handleAddItem} lists={lists} allDelete={allDelete} />
      <List lists={lists} setLists={setLists} /> {/*　③Stateが更新されたことによりListコンポーネントがサイレンダリング */}
      {lists.length >= 2 ? (
        <button onClick={allDelete} className='allDel'><FontAwesomeIcon icon={faTrash} className='clearBtn' />all delete</button>
      ) : null}
    </div>
  );
}

export default App;