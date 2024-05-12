import React, { useState } from 'react';
import Form from './Form';
import List from './List';
import './App.css';

function App() {
  const [lists, setLists] = useState([]); 
  
  const handleAddItem = (value) => {
    setLists([...lists, value]) // ②Formコンポーネントから受け取ったvalueをリストに新しく追加
  }

  return (
      <div className='wrap'>
          <p className='emoji'>📌</p>
          <h1>Happy Shopping</h1>
          <Form handleAddItem={handleAddItem} lists={lists} />
          <List lists={lists} setLists={setLists} /> {/*　③Stateが更新されたことによりListコンポーネントがサイレンダリング */}
      </div>
  );
}

export default App;
