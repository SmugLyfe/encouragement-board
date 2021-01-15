// import logo from './logo.svg';
import './App.css';
import React from 'react';

import firebase from './firebase';

const db = firebase.firestore();

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      users: [],
      loading: true
    };
  }

  componentDidMount() {
    db.collection('users').get()
      .then((snapshot) => {
        const fbUsers = snapshot.docs.map(doc => doc.data());
        this.setState({
          loading:false,
          users: fbUsers
        });
      });
  }

  render() {
    return (
      <div className="App">
        <div>HSF Encouragement Board</div>
        {this.state.loading ? <div>Loading</div> :
          <ul>
            {this.state.users.map((user, i) => (
              <li key={i}>
                Hello {user.name}
              </li>
            ))}
          </ul>
        }
      </div>
    );
  }
}

export default App;
