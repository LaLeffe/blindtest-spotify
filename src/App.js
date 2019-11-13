/*global swal*/

import React, { Component } from "react";
import logo from "./logo.svg";
import loading from "./loading.svg";
import "./App.css";
import Sound from "react-sound";
import Button from "./Button";
import { AlbumCover } from "./AlbumCover";

const apiToken = "BQDb6m_S50n-u39Jf32N4rKwlcL2R1cCNs47ADeHfjhfbdok3NHw20JE-4yHVPRiq0YTlT3y72Z-kNPiszq_91K7XDO_ffPNL08a9EmLH5IOIMqkBsbh_sXxva2IFUhM2hdYgsM3sXnHcEMYB-jgQA";

var musics = []

function shuffleArray(array) {
  let counter = array.length;

  while (counter > 0) {
    let index = getRandomNumber(counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

/* Return a random number between 0 included and x excluded */
function getRandomNumber(x) {
  return Math.floor(Math.random() * x);
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      text: "",
      songsLoaded: false,
      musics: [],
      currentTrack: {}
    };
  }

  componentDidMount() {
    this.setState({
      text: "Bonjour",
      timeout: setTimeout(() => this.selectNewTrack(), 10000)
    });

    fetch('https://api.spotify.com/v1/me/tracks', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + apiToken,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        let ran = getRandomNumber(10)
        this.setState({
          musics: data['items'],
          songsLoaded: true,
          currentTrack: data['items'][ran].track
        });
      })
  }

  checkAnswer(id) {
    if (id == this.state.currentTrack.id) {
      clearTimeout(this.state.timeout)
      swal('Bravo', 'Sous-titre', 'success')
        .then(this.selectNewTrack())
    }
    else {
      swal('Alerte !!', 'Ceci est une alerte', 'error')
    }
  }

  selectNewTrack() {
    let new_track = getRandomNumber(this.state.musics.length);
    this.setState({
      currentTrack: this.state.musics[new_track].track,
      timeout: setTimeout(() => this.selectNewTrack(), 10000)
    })
  }

  render() {
    if (this.state.songsLoaded) {
      let songs_array = []
      let second = getRandomNumber(this.state.musics.length)
      let third = getRandomNumber(this.state.musics.length)
      songs_array.push(this.state.currentTrack);
      songs_array.push(this.state.musics[second].track)
      songs_array.push(this.state.musics[third].track)
      songs_array = shuffleArray(songs_array)
      return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">{this.state.text}</h1>
          </header>
          <div className="App-images">
            <Sound url={this.state.currentTrack.preview_url} playStatus={Sound.status.PLAYING} />
            Il y a {this.state.musics.length} chansons
            <p>Re Test !</p>
            <h2>La première chanson : {this.state.musics[0]['track'].name}</h2>
            <AlbumCover track={this.state.currentTrack} />
          </div>
          <div className="App-buttons">
            {
              songs_array.map(item => (
                <Button onClick={() => this.checkAnswer(item.id)}>{item.name}</Button>
              )
              )}
          </div>
        </div>
      );
    }
    else {
      return (
        <div className="App">
          <header className="App-header">
            <img src={loading} className="App-loading" alt="loading" />
            <h1 className="App-title">{this.state.text}</h1>
          </header>
          <div className="App-images">
            <p>Loading</p>
          </div>
          <div className="App-buttons"></div>
        </div>
      );
    }

  }
}

export default App;
