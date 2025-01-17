// import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';

// import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { db, auth } from './_firebaseConfig';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import NewMessage from './components/NewMessage';
import Messages from './components/Messages';
import Landing from './components/Landing';
import Board from './components/Board';

import { CircularProgress } from '@material-ui/core';

function App() {

  const [user, loading] = useAuthState(auth);

  const usersRef = db.collection('users');
  const [users] = useCollectionData(usersRef);

  const [selectedUser, setUser] = useState('');
  const [showMessages, setShowMessages] = useState(false);

  if (!loading) {
    return (
      <div className="App">
        <Landing user={user} />
        {(users && user) &&
          <Board user={user} users={users}
            selectedUser={selectedUser}
            hideMessages={(s: any) => {
              setUser(s);
              document.body.style.overflow = 'hidden';
            }}
            showMessages={showMessages}
            userMessages={() => {
              setShowMessages(!showMessages);
            }}
          />
        }
        {(selectedUser) &&
          <NewMessage user={user} selectedUser={selectedUser}
            hideMessages={() => {
              setUser('');
              document.body.style.overflow = 'unset';
            }}
          />
        }
        {(showMessages && user) &&
          <Messages uid={user.uid}
            hideMessages={() => {
              setShowMessages(false);
              document.body.style.overflow = 'unset';
            }}
          />
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
