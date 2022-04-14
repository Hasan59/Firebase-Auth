import React, { useState } from 'react';
import './App.css';


import { GoogleAuthProvider, getAuth, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, FacebookAuthProvider } from 'firebase/auth';

import initializeAuthentication from './firebase.init';


initializeAuthentication();
const provider = new GoogleAuthProvider();
const fbprovider = new FacebookAuthProvider();





function App() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({

    IssignedIn: false,
    name: '',
    email: '',
    photo: '',
    error: "",
    success: false
  });

  const handleSignin = () => {
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then(result => {

        const { displayName, email, photoURL, } = result.user

        const signedInUser = {
          IssignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        }


        setUser(signedInUser);
      })
      .catch(error => {
        console.log(404);
      })
  };
  const fbSignIn = () => {

    const auth = getAuth();
    signInWithPopup(auth, fbprovider)
      .then((result) => {

        const user = result.user;
        console.log(user);

      })
      .catch((error) => {
        console.log(404);

      });

  }




  const signOUt = () => {

    const auth = getAuth();
    signOut(auth).then(() => {
      const signoutUser = {
        IssignedIn: false,
        name: '',
        email: '',
        photo: '',
        password: ''

      }
      setUser(signoutUser)
    }).catch((error) => {
      console.log(404);

    });

  }
  const handleChange = (e) => {


    console.log(e.target.name, e.target.value);
    let isformValid = true;
    if (e.target.name === "email") {


      isformValid = /\S+@\S+\.\S+/.test(e.target.value);

    }
    if (e.target.name === "password") {
      const ispasswordValid = e.target.value.length > 6;

      const passwordhasNumber = /\d{1}/.test(e.target.value);
      isformValid = (passwordhasNumber && ispasswordValid);

    }
    if (isformValid) {
      const newUserinfo = { ...user };
      newUserinfo[e.target.name] = e.target.value;
      setUser(newUserinfo);


    }





  }
  const handleSubmit = (e) => {
    if (newUser && user.email && user.password) {


      const auth = getAuth();
      createUserWithEmailAndPassword(auth, user.email, user.password)
        .then(() => {
          const newUserinfo = { ...user };
          newUserinfo.error = '';
          newUserinfo.success = true;
          setUser(newUserinfo);








        })
        .catch((error) => {





          const newUserinfo = { ...user };
          newUserinfo.success = false;
          newUserinfo.error = "This email is already existed.";

          setUser(newUserinfo);







        });


    }
    if (!newUser && user.email && user.password) {


      const auth = getAuth();
      signInWithEmailAndPassword(auth, user.email, user.password)
        .then((userCredential) => {
          const newUserinfo = { ...user };
          newUserinfo.error = '';
          newUserinfo.success = true;
          setUser(newUserinfo);


        })
        .catch((error) => {
          const newUserinfo = { ...user };
          newUserinfo.success = false;
          newUserinfo.error = "This email is already existed.";

          setUser(newUserinfo);

        });

    }


    e.preventDefault();
  }



  return (
    <div>
      {user.IssignedIn ? <button onClick={signOUt} className="btn btn-outline-success" style={{ marginTop: "15px", marginLeft: "700px" }}>Sign out</button> : <button style={{ marginTop: "15px", marginLeft: "700px", paddingLeft: "10px" }} className='btn btn-outline-success' onClick={handleSignin}>Sign in</button>}
      <button onClick={fbSignIn} className="btn btn-outline-info" style={{ marginTop: "15px", marginLeft: "700px" }}>Sign in using Facebook.</button>



      {user.IssignedIn && (
        <div style={{ marginLeft: "40px", color: "lightblue" }}>
          <h4 >Welcome {user.displayName} </h4>
          <h4>Email:{user.email}</h4>
          Photo: <img src={user.photo} alt="not found" />



        </div>
      )


      }
      {/* <h3 style={{ marginLeft: "20px", color: "orange" }}>Our Own Authentication.</h3> */}


      <form style={{ marginLeft: "20px" }} onSubmit={handleSubmit}>
        <div>
          <span style={{ color: "orange", fontWeight: "bolder", fontSize: "32px" }} >{newUser ? 'Sign Up' : 'Sign in'} </span><input type="checkbox" name="" id="" onChange={() => setNewUser(!newUser)} />
        </div>
        <div className='form-group'>
          <div>

            {newUser && <input type="text" id='name' className='form-control' placeholder='Write Your Name' />}
          </div>

          <div>
            <label For="email">Email:</label>

            <input type="text" name="email" onBlur={handleChange} placeholder='Enter your Email' id="email" className='form-control' required /><br /></div>
          <div> <label For="password">Password:</label>
            <input onBlur={handleChange} type="password" name="password" placeholder='Enter Password' id="password" className='form-control' required /></div>
        </div>
        <div>
          <button style={{ marginTop: "20px" }} type='submit' className='btn btn-secondary'>{newUser ? 'Sign Up' : 'Sign in'}</button>
        </div>
      </form >
      <h3 style={{ marginTop: "15px", textAlign: "center", color: "gray" }}>{user.error}</h3>

      {
        user.success && <h3 style={{ marginTop: "15px", textAlign: "center", color: "green" }}>User {newUser ? 'created' : 'logged in'} successfully.</h3>
      }


    </div >
  );
}
export default App;