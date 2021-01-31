import './Messages.css';
import React, { useState, useRef, useMemo } from 'react';
import { useReactToPrint } from 'react-to-print';

import firebase from 'firebase/app';
import { useCollectionData } from 'react-firebase-hooks/firestore';
const db = firebase.firestore();
const storageRef = firebase.storage().ref();

function Messages(props: any) {
  const userRef = db.collection('users').doc(props.uid);
  const letterRef = userRef.collection('messages');
  const [letters] = useCollectionData(letterRef);
  const [envelopeImage, setEnvImg] = useState<Blob>();
  const [index, setIndex] = useState(0);

  const d = new Date();
  const releaseTime = new Date("2021-01-16T12:00:00.01");

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });


  if (d < releaseTime) {
    return (
      <div className="pre-message-modal">
        <button className="close x" onClick={props.hideMessages}>x</button>
        <h3>
          You will receive your messages at 12pm on 2/16/2021!
        </h3>
        <b>
          In the meantime, let's write some more letters!
        </b>
      </div>
    )
  }
  else if (letters) {
    if (letters.length === 0) {
      return (
        <div className="pre-message-modal">
          <button className="close x" onClick={props.hideMessages}>x</button>
          <h3>
            You didn't receive any letters this year!
          </h3>
          <b>
            So here's a letter from us!
          </b> <br />
          <p>
            We are super grateful that you joined us for our winter retreat!
            <br />
            We hope that God was able to use this weekend to help you learn
            more about what it's like to live fully for Him!
            <br />
            We were blessed to have you and eagerly hope to see you again when
            the pandemic is over!
          </p>
        </div>
      );
    }
    else {
      return (
        <div className="message-container">
          <button className="close x" onClick={props.hideMessages}>x</button>
          <button className="print-button x" onClick={handlePrint}>Print</button>
          <div className="message-modal">
            <div className="message-bg" ref={componentRef}>
              {letters.map((l:any, i:number) => (
                (l.text.length !== 0) &&
                    <div className="encouragement-letter">
                      {l.text.map((block: any) => (
                        <p className={block.style}>{block.message}</p>
                      ))}
                      <b>Sent by: {l.displayName}</b>
                    </div>
              ))}
            </div>
          </div>
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
