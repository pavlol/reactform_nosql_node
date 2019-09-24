import React, {Component} from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.NODE_ENV === 'production' ? "https://reactform-nosql-node-api.herokuapp.com" : "http://localhost" ;
const API_PORT = process.env.NODE_ENV === 'production' ? "443" : "3090" ;
const API_ADDRESS = `${API_URL}:${API_PORT}`;

class App extends Component{
  constructor(props){
      super(props);
      this.state = {
        firstName : "",
        lastName : "",
        email : "",
        employed: false,
        employer : "",
        employerAddress : "",
        message: ""
      }

    }
  handleFirstName = (e) => {
    this.setState({firstName : e.target.value})
  }

  handleLastName = (e) => {
    this.setState({lastName : e.target.value})
  }
  
  handleEmail = (e) => {
    this.setState({email : e.target.value})

  }

  handleEmployed = (e) => {
    this.setState({employed : !this.state.employed})
  }

  handleEmployer = (e) => {
    this.setState({employer : e.target.value})
  }

  handleEmployerAddress = (e) => {
    this.setState({employerAddress : e.target.value})
  }

  handleFormSave = (e) => {
    e.preventDefault();
    this.saveForm((err, message) => {
      if(err){
        console.log(`Error. ${message}`);
        this.setState({message});
      }
      else{
        console.log(`${message}`);
        this.setState({
          firstName : "",
          lastName : "",
          email : "",
          employed: false,
          employer : "",
          employerAddress : "",
          message: message
        });
      }
    }) 
  }

  renderMessage = (message) => {
    return <div>{this.state.message}</div>
  }

  saveForm = (callback) => {
    console.log(API_ADDRESS);
    const {firstName, lastName, email, employed, employer, employerAddress} = this.state;
    axios.post(`${API_ADDRESS}/form/create`, {firstName, lastName, email, employed, employer, employerAddress}, { })
    .then(response => {
      console.log('response ok', response.data);
      callback(false, "Data saved");
    })
    .catch((e)=>{
        let customMessage = e.response ? e.response.data : "";
        if(e.response && e.response.status == 401){
          callback(true, customMessage);
        }
        else if(e.response && e.response.status == 422){
          customMessage = e.response.data.error;
          callback(true, customMessage);
        }
        else{
          const combinedErrorMessage = `${e.message}`;
          callback(true, combinedErrorMessage);
        }
      });
  }

  render(){
    return (
      <div className="App">
      <form>
        <div>
          <input placeholder="First Name" name="firstName" value={this.state.firstName} onChange={this.handleFirstName} />
        </div>
        <div>
          <input placeholder="Last Name" name="lastName" value={this.state.lastName} onChange={this.handleLastName} />
        </div>
        <div>
          <input placeholder="Email" value={this.state.email} onChange={this.handleEmail} />
        </div>
        <div>
          Are you employed? <input type="checkbox" value={this.state.employed} onChange={this.handleEmployed} />
        </div>
        <div>
          {this.state.employed ? 
            <input placeholder="Employer" value={this.state.employer} onChange={this.handleEmployer} /> : ""
          }
        </div>
        <div>
          {this.state.employer.length > 0 ? 
            <input 
              placeholder="Employer address" 
              value={this.state.employerAddress} 
              onChange={this.handleEmployerAddress} /> : ""
          }
        </div>
        <div>
          <input type="submit" onClick={this.handleFormSave} value="Save"/>
        </div>
      </form>
      {this.renderMessage()}
      </div>
    );
  }
}

export default App;
