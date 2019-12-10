import React from 'react';
import './App.css';

class App extends React.Component {
  
  constructor(props){
    super(props)
    this.state ={
      songname : "mp3",
      url: ""
    }
  }

  render(){
  return (
    <div className="container">      
      <h1>Music App</h1>
       <div>
         Song Name: {this.state.songname}
       </div>
        <audio controls>
            <source src={this.state.url} type="audio/mpeg"></source>
        </audio>
    </div>
  );
}
}

export default App;
