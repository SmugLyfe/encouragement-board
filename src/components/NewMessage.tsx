import './NewMessage.css';
import React, { useRef, useState, useEffect } from 'react';
import { useDocumentData, useCollectionData } from 'react-firebase-hooks/firestore';

import firebase from 'firebase/app';
const db = firebase.firestore();

export interface MessageType {
  text: any;
  id: string;
  displayName: string;
  uid: string;
  photoURL: string;
  createdAt: Date;
}

function NewMessage (props: any) {

  const [formValue, setFormValue] = useState('');
  const [alreadySent, setSent] = useState(false);
  const suRef = db.collection('users').doc(props.selectedUser);
  const messagesRef = suRef.collection('messages');
  const [selected, loading] = useDocumentData<any>(suRef);
  const [msgs, msgLoading] = useCollectionData(messagesRef);
  const [sentMsg, setSentMsg] = useState<MessageType>();

  const sendMessage = async (e: any) => {
    e.preventDefault();

    const { uid, photoURL, displayName } = props.user;
    const text = {
      message: formValue,
      style: 'text',
    };


    if (sentMsg) {
      await messagesRef.doc(sentMsg.id).update({
        text: firebase.firestore.FieldValue.arrayUnion(text),
      });
    }
    else {
      await messagesRef.add({
        text: [text],
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        displayName,
        photoURL
      }).then((newDoc) => {
        messagesRef.doc(newDoc.id).update({
          id: newDoc.id,
        });
      });
    }

    setFormValue('');
  }

  const deleteMessage = async (e:any) => {

  }

  useEffect(() => {
    // check to see if a message has already been sent
    if (msgs && msgs.length != 0) {
      msgs.map((msg:any) => {
        if (msg.displayName == props.user.displayName) {
          setSent(true);
          setSentMsg(msg);
        }
      });
    }
  }, [msgLoading]);

  return (
    (!loading && !msgLoading) ?
      ((alreadySent && sentMsg) ?
          <div>
            <p>Your message to {selected.name}</p>
            {sentMsg.text.map((m:any, i:number) => (
              <p key={i} className={m.style}>{m.message}</p>
            ))}
          </div>
      :
        <form onSubmit={sendMessage}>
          <button className="close" onClick={props.hideMessages}>x</button>
          <p>Message to {selected.name}</p>
          <textarea value={formValue}
            onChange={(e) => {
              setFormValue(e.target.value)}}
            placeholder="say something nice" />
          <button type="submit" disabled={!formValue}>🕊️</button>
        </form> )
    : <div></div>
  );
}

export default NewMessage;
