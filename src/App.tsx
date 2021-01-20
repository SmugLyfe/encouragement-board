// import logo from './logo.svg';
import './App.css';
import React, { useRef, useState } from 'react';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { db, auth } from './firebaseConfig';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import NewMessage from './components/NewMessage';
import Messages from './components/Messages';
import Landing from './components/Landing';

function App() {

  const [user] = useAuthState(auth);

  const usersRef = db.collection('users');
  const [users] = useCollectionData(usersRef);

  const [selectedUser, setUser] = useState('');
  const [showMessages, setShowMessages] = useState(false);

  return (
    <div className="App">
      <Landing user={user} />
      {(users && user) &&
        <div className="encouragement-board">
          {users.map((u: any, i: number) => (
            <div className="user">
              <button className="envelope" key={i} onClick={()=> {
                if (selectedUser && selectedUser == u.uid) {
                  setUser('');
                } else if (user.uid == u.uid) {
                  setShowMessages(!showMessages);
                  setUser('');
                } else {
                  setUser(u.uid);
                  if (showMessages) {
                    setShowMessages(!showMessages);
                  }
                }
              }}>
              </button>
                {u.name}
            </div>

          ))}
        </div>
      }
      { (selectedUser) &&
      <NewMessage user={user} selectedUser={selectedUser}
        hideMessages={() => setUser('')}
      />
      }
      { (showMessages) &&
        <Messages uid={user.uid} />
      }
    </div>
  );
}

export default App;
