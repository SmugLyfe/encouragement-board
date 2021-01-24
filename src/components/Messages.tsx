// import './Messages.css';
import React, { useState } from 'react';

import firebase from 'firebase/app';
import { useCollectionData } from 'react-firebase-hooks/firestore';
const db = firebase.firestore();
const storageRef = firebase.storage().ref();

function Messages(props: any) {
  const userRef = db.collection('users').doc(props.uid);
  const letterRef = userRef.collection('messages');
  const [letters] = useCollectionData(letterRef);
  const [envelopeImage, setEnvImg] = useState<Blob>();

  const addImage = async (e:any) => {
    e.preventDefault();

    const photoRef = storageRef.child(`envelopes/${props.uid}.jpg`);

    if (envelopeImage) {
      await photoRef.put(envelopeImage).then((snapshot) => {
        console.log(snapshot);
      });
      photoRef.getDownloadURL().then((url) => {
        userRef.update({
          envelopeURL: url
        })
      });
    }
  };

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
            (l.text.length !== 0) &&
              <div>
                {l.text.map((block: any) => (
                  <p className={block.style}>{block.message}</p>
                ))}
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
