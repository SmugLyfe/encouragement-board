// import './Messages.css';
import React, { useState } from 'react';

import firebase from 'firebase/app';
import { useCollectionData } from 'react-firebase-hooks/firestore';
const db = firebase.firestore();

function Messages(props: any) {
  const letterRef = db.collection('users')
                      .doc(props.uid).collection('messages');
  const [letters] = useCollectionData(letterRef);

  if (letters) {
    if (letters.length == 0) {
      return (
        <div>
          No letters yet!
        </div>
      );
    }
    else {
      return (
        <div>
          {letters.map((l:any, i:number) => (
            <div>
              <p>{l.text[0]}</p>
              <p>Sent by: {l.displayName}</p>
            </div>
          ))}
        </div>
      );
    }
  }
  else {
    return (
      <div>
        Loading!
      </div>
    );
  }
}

export default Messages;
