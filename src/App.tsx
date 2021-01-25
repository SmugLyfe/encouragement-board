// import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';

// import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { db, auth } from './firebaseConfig';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import NewMessage from './components/NewMessage';
import Messages from './components/Messages';
import Landing from './components/Landing';

import { CircularProgress } from '@material-ui/core';

import envelope0 from './images/envelope_0.png';
import envelope1 from './images/envelope_1.png';
import envelope2 from './images/envelope_2.png';

function App() {

  const [user, loading] = useAuthState(auth);

  const usersRef = db.collection('users');
  const [users] = useCollectionData(usersRef);

  const [selectedUser, setUser] = useState('');
  const [showMessages, setShowMessages] = useState(false);

  const openEnvelope = (u: any) => {
    if (selectedUser && selectedUser === u.uid) {
      // double click on same user
      setUser('');
    } else if (user.uid === u.uid) {
      // clicked on own envelope
      setShowMessages(!showMessages);
      setUser('');
    } else {
      // clicked on another user
      setUser(u.uid);
      if (showMessages) {
        setShowMessages(!showMessages);
      }
    }
  }

  if (!loading) {
    return (
      <div className="App">
        <Landing user={user} />
        {(users && user) &&
          <div className="encouragement-board">
            {users.map((u: any, i: number) => (
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
                {u.name} {(user.uid === u.uid) && <b>(me)</b>}
                </p>
              </div>
            ))}
          </div>
        }
        {(selectedUser) &&
          <NewMessage user={user} selectedUser={selectedUser}
            hideMessages={() => setUser('')}
          />
        }
        {(showMessages && user) &&
          <Messages uid={user.uid} />
        }
      </div>
    );
  }
  else {
    return (
      <div className="loading">
        <CircularProgress />
      </div>
    );
  }
}

export default App;
