import React from 'react';
import YourSide from './YourSide.jsx';
import TheirSide from './TheirSide.jsx';

export default class App extends React.Component {
  constructor() {
    super();

    this.state = {
      yours: {
        name: '',
        image: '',
        body: '',
      },
      theirs: {
        name: '',
        image: '',
        body: '',
      }
    }

    this.getEventData = this.getEventData.bind(this);
    this.updatePostBody = this.updatePostBody.bind(this);
    setInterval(this.getEventData, 1000);
  }

  render() {
    return (
      <div>
        <div className='row'>
          <YourSide name={this.state.yours.name} image={this.state.yours.image} body={this.state.yours.body} updateBody={this.updatePostBody} />
          <TheirSide name={this.state.theirs.name} image={this.state.theirs.image} body={this.state.theirs.body} />
        </div>
        <div className='row text-center'>
          <button id='accept' className='btn btn-success' onClick={() => this.updatePostBody(null, true)}>Accept this agreement</button>
        </div>
      </div>
    );
  }

  componentWillMount() {
    this.getEventData();
  }

  getEventData() {
    const xhr = new XMLHttpRequest;
    xhr.open('GET', 'http://localhost:3000/event/5961542d933efc06b4b52cb5');
    xhr.send();

    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) return;
      const eventData = JSON.parse(xhr.response);

      this.setState({
        yours: {
          name: eventData.yours.profile.username,
          image: eventData.yours.profile.image,
          body: eventData.yours.post.text,
        },
        theirs: {
          name: eventData.theirs.profile.username,
          image: eventData.theirs.profile.image,
          body: eventData.theirs.post.text,
        },
      });
    }
  }

  updatePostBody(text, agreed) {
    const xhr = new XMLHttpRequest;
    xhr.open('Post', 'http://localhost:3000/event/5961542d933efc06b4b52cb5');
    xhr.setRequestHeader('Content-Type', 'application/json');

    const sendData = {};
    if (text) sendData.text = text;
    sendData.agreed = agreed ? true : false;
    
    xhr.send(JSON.stringify(sendData));

    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) return;
      this.getEventData();
    }
  }
};