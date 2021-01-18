// import logo from './logo.svg';
import './App.css';
import React, { useRef, useState } from 'react';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import firebaseConfig from './firebaseConfig';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const db = firebase.firestore();


function App() {

  const [user] = useAuthState(auth);

  const usersRef = db.collection('users');
  const [users] = useCollectionData(usersRef);

  const [formValue, setFormValue] = useState('');
  const [selectedUser, setUser] = useState('');
  const [showMessages, setShowMessages] = useState(false);

  const sendMessage = async (e: any) => {
    e.preventDefault();

    const { uid, photoURL, displayName } = user;
    // choose new uid
    const messagesRef = db.collection('users').doc(selectedUser)
                          .collection('messages');

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
    <div className="App">
      <div>HSF Encouragement Board</div>
      {
        user
          ? (
            <div>
              <p>Hello, {user.displayName}</p>
              <SignOut />
            </div>
          )
          : (
            <div>
              <p>Please sign in.</p>
              <SignIn />
            </div>
          )
      }
      {(users && user) ?
        <div className="encouragement-board">
          {users.map((u: any, i: number) => (
            <div className="user">
              <button className="envelope" key={i} onClick={()=> {
                if (selectedUser && selectedUser == u.uid) {
                  setUser('');
                } else if (user.uid == u.uid) {
                  setShowMessages(!showMessages);
                } else {
                  setUser(u.uid);
                }
              }}>
              </button>
                {u.name}
            </div>

          ))}
        </div>
        : <div>Hello World</div>
      }
      { (selectedUser) &&
      <form onSubmit={sendMessage}>
        <textarea value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="say something nice" />
        <button type="submit" disabled={!formValue}>🕊️</button>
      </form> }
      { (showMessages) &&
        <Messages uid={user.uid} />
      }
    </div>
  );
}

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
          {letters.map((l:any) => (
            <div>
              <p>{l.text}</p>
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

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
      .then(async (result) => {
        if (result.user != null) {
          const u = await db.collection('users')
            .where("email", "==", result.user.email)
            .get();
          // console.log(u.docs);
          // make a new user if there is no user existing
          if (u.empty) {
            db.collection('users').doc(result.user.uid).set({
              name: result.user.displayName,
              email: result.user.email,
              uid: result.user.uid,
              notesReceived: 0,
              notesWritten: 0
            })
            .then(() => {
              console.log('New user added!');
            });
          }
        }
      });
  }

  return (
    <div>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  )

}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}



export default App;
