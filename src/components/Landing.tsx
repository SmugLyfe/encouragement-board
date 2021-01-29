import './Landing.css';
import React, { useState } from 'react';

import allin from '../images/all-in-logo.png';
import landing from '../images/landing.png';
import envelope1 from '../images/envelope_1.png';
import envelope2 from '../images/envelope_2.png';

import firebase from 'firebase/app';
import 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

const db = firebase.firestore();
const auth = firebase.auth();
const storageRef = firebase.storage().ref();

function Landing (props: any) {

  const user = props.user;
  const [firstLogin, setFirstLogin] = useState(false);

  return (
    user
      ? (
        <div>
          { firstLogin ?
            <Tutorial /> :
            <div className="nav">
              <p>{user.displayName}</p>
              <div className="nav__button-group">
                <ChangeImage />
                <SignOut />
              </div>
            </div>
          }
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

  function Tutorial() {
    return (
      <div className="tutorial">
        <div className="tutorial-row">
          <div className="left">
            <h1>
              Welcome, {user.displayName}!
            </h1>
            <h3>
              We are so happy you are here!
            </h3>
          </div>
          <img className="tutorial-logo" src={allin} />
        </div>
        <div className="tutorial-row">
          <img className="left-img" src={envelope1} />
          <div className="right">
            <p>
              Encouragement notes are some of our favorite
              parts about Winter Retreat, so we made a virtual version for you!
            </p>
            <b>
              Here are some tips about how to use this website:
            </b>
          </div>
        </div>
        <div className="tutorial-row">
          <div className="left">
            <ol>
              <li>
                Click on an envelope to start writing a message!
              </li>
              <li>
                You can write multiple lines/entries in a single letter, so feel
                free to get creative and encouraging!
              </li>
              <li>
                On the last day of retreat, you'll be able to see all the
                letters that have been written to you!
              </li>
            </ol>
          </div>
          <img className="right-img" src={envelope2} />
        </div>
        <button className="sign-in" onClick={()=>setFirstLogin(false)}>
          Let's get started!
        </button>
      </div>
    )
  }

  function ChangeImage() {
    const userRef = db.collection('users').doc(user.uid);
    const [envelopeImage, setEnvImg] = useState<Blob>();
    const [showForm, setShowForm] = useState(false);

    const addImage = async (e:any) => {
      e.preventDefault();

      const photoRef = storageRef.child(`envelopes/${user.uid}.jpg`);

      if (envelopeImage) {
        await photoRef.put(envelopeImage).then((snapshot) => {
          // console.log(snapshot);
          setShowForm(false);
        });
        photoRef.getDownloadURL().then((url) => {
          userRef.update({
            envelopeURL: url
          })
        });
      }
    }

    return (
      showForm ?
      <form className="decorate-form" onSubmit={addImage}>
        <input type="file" id="file"
          onChange={(e) => {
            if (e && e.target && e.target.files) {
            setEnvImg(e.target.files[0]);}
          }} />
        <label htmlFor="file">Choose an image/gif</label>
        <button disabled={!envelopeImage} type="submit">Submit</button>
      </form> :
      <button className="decorate" onClick={() => setShowForm(true)}>
        Decorate Envelope
      </button>
    )
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
