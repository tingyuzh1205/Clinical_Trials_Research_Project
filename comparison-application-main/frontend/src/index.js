import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai"
import PatientDisplay from './PatientDisplay.js';
import ResultTable from './ResultTable.js';


//This is the main (parent) class. This is the first component to be created.
class Display extends React.Component{
  //Runs only on refresh
  constructor(props){
    super(props);
    //Bind functions 
    this.executeSearch=this.executeSearch.bind(this);
    this.addSelect = this.addSelect.bind(this);
    this.falseSelected = this.falseSelected.bind(this);
    this.trueSelected = this.trueSelected.bind(this);
    // this.showTable = this.showTable.bind(this);
    //Since we want to use these values elsewhere, add them to the state since state is persistent (each componenet instance has own state).
    //, table: true, tableButton: false, tableButton: true
    this.state = {trials: [], ready: false, userInput: null, selectedR: [], selected: false}; 
  }

  //Runs when input form is submitted - takes input form as argument
  executeSearch(formData){
    let results = [];
    //Make call to backend API and send the form data
    this.setState({userInput: formData, loading: true});
    fetch('http://127.0.0.1:5000/api/sortTrialsByCriteria', {method: 'POST', body: formData})
      .then(response => response.json())
      .then((result) => {
        //Store every trial returned from backend
        for(let i = 0; i < result.data.length; i++){
          let trial = result.data[i];
          // trial.select = false;
          results.push(trial);
        }
        //, table: true
        this.setState({trials: results, numDisplays: result.data.length, ready: true, loading: false, selectedR: []});
      },
      (error) => {alert(error)});
    return false;
  }

  addSelect(study) {
    let list = this.state.selectedR;
    list.push(study);
     //.Study.ProtocolSection.IdentificationModule.NCTId
    let set = Array.from(new Set(list));

     this.setState({ selectedR: set });
     console.log(this.state.selectedR);

  }

  falseSelected(){
    let selectedList = this.state.selectedR;
    let wholeList = this.state.trials;

    for(let i = 0; i <wholeList.length; i +=1){
      if (selectedList.includes(wholeList[i])){
        wholeList.splice(i, 1);
      }
    }
    this.setState({selected: false, trials: wholeList});
  }

  trueSelected(){
    let selectedList = this.state.selectedR;
    let wholeList = this.state.trials;

    for(let i = 0; i <wholeList.length; i +=1){
      if (selectedList.includes(wholeList[i])){
        wholeList.splice(i, 1);
      }
    }
    this.setState({selected: true, trials: wholeList});
  }
   
  


  //Function to display the result table and thus not display the 'show table' button
  // showTable(){
  //   this.setState({table: true, tableButton: false});
  // }


  //Displays to the screen
  render(){
    return(
      <div className="Background">
        <div className = 'PatientAndTrials'>
          <PatientDisplay className="PatienDisplay" executeSearch={this.executeSearch} trueSelected ={this.trueSelected} 
          falseSelected ={this.falseSelected} selected ={this.state.selected}/>
          
          {this.state.loading ? <center><br /><div className="spinner-border" role="status"><span className="sr-only"></span></div></center> : null}
          
          {(!this.state.loading) && (!this.state.selected) ? <ResultTable className="ResultTable" data={this.state.trials} inputData={this.state.userInput}
          addSelect = {this.addSelect}></ResultTable> : null}

          {(!this.state.loading) && this.state.selected ? <ResultTable className="ResultTable" data={this.state.selectedR} inputData={this.state.userInput}
          addSelect = {this.addSelect}></ResultTable> : null}

        </div>
      </div>
    );
  }
}




//This is the root which triggers the parent component (Display) to run
ReactDOM.render(
  <Display />, //Triggers main component to display
  document.getElementById('root')
);

//this.state.table