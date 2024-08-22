import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faChevronLeft, faXmark, faPen, faBars } from "@fortawesome/free-solid-svg-icons";
import { deleteDoc, doc, updateDoc, onSnapshot } from "firebase/firestore";
import db from "./config/firebase";

const List = ({ lists, setLists }) => {

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedLists = Array.from(lists);
        const [movedItem] = reorderedLists.splice(result.source.index, 1);
        reorderedLists.splice(result.destination.index, 0, movedItem);

        setLists(reorderedLists);
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
                {(provided) => (
                    <ul {...provided.droppableProps} ref={provided.innerRef}>
                        {lists.length === 0 ? (
                            <p className='empty_txt'>Let's add list!</p>
                        ) : (
                            lists.map((item, index) => (
                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                    {(provided) => (
                                        <ListItem
                                            item={item}
                                            setLists={setLists}
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            dragHandleProps={provided.dragHandleProps}
                                        />
                                    )}
                                </Draggable>
                            ))
                        )}
                        {provided.placeholder}
                    </ul>
                )}
            </Droppable>
        </DragDropContext>
    );
}

const ListItem = React.forwardRef(({ item, setLists, dragHandleProps, ...props }, ref) => {
    const [count, setCount] = useState(item.count); // 親からもったlist内のcountプロパティを初期値に設定
    const [done, setDone] = useState(false);
    const [buy, setBuy] = useState(false);
    const [listvalue, setListvalue] = useState(item.item); // 親からもったlist内のitemプロパティを初期値に設定

    // アイテム個数state
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

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, 'shoppinglist', item.id), (docSnapshot) => {
            if (docSnapshot.exists()) {
                setCount(docSnapshot.data().count);
            }
        });
        return () => unsubscribe();
    }, [count]);

    // リストの再編集state
    const keyDown = async (e) => {
        if (e.key === 'Enter' && listvalue.trim() !== '') { // 入力エリアが空欄ではなく、Enterが押されたら
            e.preventDefault();
            await updateDoc(doc(db, 'shoppinglist', item.id), { item: listvalue }); // リスト内容が変更されたものと、同一のidを持つデータをshoppinglist dbから探して更新
            setDone(false);
        }
    }

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
            <span style={{ textDecoration: buy ? 'line-through' : 'none' }}>{listvalue}</span>
        )
    }

    // リストの削除state
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

    // 打ち消し線とチェックボックスのstate
    const toggleBuy = async () => {
        const newBuy = !buy;
        await updateDoc(doc(db, 'shoppinglist', item.id), { buy: newBuy });
    }

    useEffect(() => {
        const unsub = onSnapshot(doc(db, 'shoppinglist', item.id), (docSnapshot) => {
            if (docSnapshot.exists()) {
                setBuy(docSnapshot.data().buy);
            }
        });
        return () => unsub();
    }, [item.id]);


    return (
        <li ref={ref} {...props}>
            <div className='flex'>
                <div className='drug' {...dragHandleProps}>
                    <FontAwesomeIcon icon={faBars} />
                </div>
                <div className='item_wrap flex'>
                    <label>
                        <input type='checkbox' checked={buy} onChange={toggleBuy} />
                        {listContent}
                    </label>
                    <div className='couner_wrap'>
                        <FontAwesomeIcon icon={faPen} onClick={() => { setDone(!done) }} />
                        <div className='couner'>
                            <FontAwesomeIcon icon={faChevronLeft} onClick={countDown} />
                            <span>{count}</span>
                            <FontAwesomeIcon icon={faChevronRight} onClick={countUp} />
                        </div>
                        <FontAwesomeIcon icon={faXmark} onClick={handleDelete} />
                    </div>
                </div>
            </div>
        </li>
    );
});

export default List;