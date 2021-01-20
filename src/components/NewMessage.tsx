import './NewMessage.css';
import React, { useRef, useState } from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';

import firebase from 'firebase/app';
const db = firebase.firestore();

function NewMessage (props: any) {

  const [formValue, setFormValue] = useState('');
  const suRef = db.collection('users').doc(props.selectedUser);
  const [selected, loading] = useDocumentData<any>(suRef);

  const sendMessage = async (e: any) => {
    e.preventDefault();

    const { uid, photoURL, displayName } = props.user;
    // choose new uid
    const messagesRef = suRef.collection('messages');

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      displayName,
      photoURL
    })

    setFormValue('');
  }

  return (
    (!loading) ?
    <form onSubmit={sendMessage}>
      <button className="close" onClick={props.hideMessages}>x</button>
      <p>Message to {selected.name}</p>
      <textarea value={formValue}
        onChange={(e) => {
          setFormValue(e.target.value)}}
        placeholder="say something nice" />
      <button type="submit" disabled={!formValue}>🕊️</button>
    </form> : <div></div>
  );
}

export default NewMessage;
