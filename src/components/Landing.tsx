import './Landing.css';
import React, { useState } from 'react';

import allin from '../images/all-in-logo.png';

import firebase from 'firebase/app';
import 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

const db = firebase.firestore();
const auth = firebase.auth();

function Landing (props: any) {

  const user = props.user;
  const [firstLogin, setFirstLogin] = useState(false);

  // TO DO: Make a tutorial on first login

  return (
    user
      ? (
        <div className="nav">
          <p>{user.displayName}</p>
          <SignOut />
        </div>
      )
      : (
        <div className="landing-container">
          <img className="landing-logo" src={allin} />
          <div className="welcome-banner">
            <h1>HSF Winter Retreat 2021</h1>
            <h1 className="theme">All In</h1>
            <h3>Encouragement Board</h3>
          </div>
          <br />
          <br />
          <br />
          <SignIn />
        </div>
      )
  );

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
                setFirstLogin(true);
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
      <button className="sign-out" onClick={() => auth.signOut()}>
        Sign out
      </button>
    )
  }
}

export default Landing;
