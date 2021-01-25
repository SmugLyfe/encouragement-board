import './Board.css';
import React, { useState } from 'react';

import envelope0 from '../images/envelope_0.png';
import envelope1 from '../images/envelope_1.png';
import envelope2 from '../images/envelope_2.png';

function Board (props:any) {

  const openEnvelope = (u: any) => {
    if (props.selectedUser && props.selectedUser === u.uid) {
      // double click on same user
      props.hideMessages('');
    } else if (props.user.uid === u.uid) {
      // clicked on own envelope
      props.userMessages();
      props.hideMessages('');
    } else {
      // clicked on another user
      props.hideMessages(u.uid);
      if (props.showMessages) {
        props.userMessages();
      }
    }
  }

  return (
    <div className="encouragement-board">
      {props.users.map((u: any, i: number) => (
        <div className="user">
          {(u.notesReceived > 5 && u.notesWritten > 5) &&
            <img src={envelope2} className="envelope-outline"
              onClick={() => openEnvelope(u)}/>
          }
          {(u.notesReceived > 5 && u.notesWritten <= 5) &&
            <img src={envelope1} className="envelope-outline"
              onClick={() => openEnvelope(u)}/>
          }
          {(u.notesReceived <= 5) &&
            <img src={envelope0} className="envelope-outline"
              onClick={() => openEnvelope(u)}/>
          }
          <button className="envelope" key={i}
            style = {{
              backgroundImage: `url(${u?.envelopeURL})`,
              backgroundSize: "cover",
              backgroundPosition: "center center",
            }}
            >
          </button>
          <p>
          {u.name} {(props.user.uid === u.uid) && <b>(me)</b>}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Board;
