import React from 'react';


// this is the form for the class
export default class PatientDisplay extends React.Component{
	constructor(props){
    super(props);
    this.state = {executeSearch: this.props.executeSearch}; //Functions passed from parent tableButton: this.props.tableButton
    //Bind functions
    this.handleSubmit = this.handleSubmit.bind(this);
    // this.showTable = this.props.showTable.bind(this);
    //this.showSelected = this.props.showSelected.bind(this);
  }

  //Runs when form is submitted
  handleSubmit(event){
    event.preventDefault(); //Prevents refresh of entire page
    let formData = new FormData(event.target); //Gets form input data
    this.state.executeSearch(formData); //calls executeSearch (see parent class)
    // console.log('aaaaaaaaa form data');
    // console.log(formData);// print out hte format of form result
  }

  //Runs when a prop from the parent changes
  // componentDidUpdate(prevProps){
  //   if(this.props.tableButton != prevProps.tableButton){
  //     this.setState({tableButton: this.props.tableButton});
  //   }
  // }

  render(){
    //Set styles as constants to use throughout
    return(
      <div className='PatientDisplay'>
        <div className="container-fluid">
          <div className="row justify-content-md-start">
            <p className="col-12 fs-4">This interface retrieves information for <a href= "https://clinicaltrials.gov/">clinicaltrials.gov</a> and filters it according to the criteria specified.</p>
          </div>
          <div className="row justify-content-md-start">
            <p className="Header1" className="col-12 col-md-6 fs-1 pt-3 text-center">Clinical Trials Information</p>
            <p className="Header1" className="col-12 col-md-6 fs-1 pt-3 text-center">Patient Information</p>
          </div>

          <form onSubmit={this.handleSubmit} className="row justify-content-around">          

            <div className= "col-12 col-md-2 form-floating">          
              <input type="text" className="form-control form-control-lg fs-4 " name="keyword" id = "keyword" placeholder="REQUIRED"/>
              <label htmlFor="keyword">Key Word (Required)</label>
            </div>


             <div className= "col-12 col-md-2 form-floating">          
              <input type="text" className="form-control form-control-lg fs-4 " name="type" id = "type" placeholder="REQUIRED"/>
              <label htmlFor="type">Study Type</label>
            </div>

            <div className= "col-12 col-md-2 form-floating">          
              <input type="text" className="form-control form-control-lg fs-4 " name="condition" id = "condition" placeholder="REQUIRED"/>
              <label htmlFor="condition">Condition</label>
            </div>


            <div className= "col-6 col-md-1 form-floating">          
              <input type="text" className="form-control form-control-lg fs-4 " name="min" id = "min" placeholder="REQUIRED"/>
              <label htmlFor="min">Min age</label>
            </div>

            <div className= "col-6 col-md-1 form-floating">          
              <input type="text" className="form-control form-control-lg fs-4 " name="max" id = "max" placeholder="REQUIRED"/>
              <label htmlFor="max">Max age</label>
            </div>

            <div className="form-floating col-12 col-md-1">
              <select className="form-select form-select-lg fs-6" id="gender" aria-label="Default" name ='gender' defaultValue="None">
                <option value="None">None</option>
                <option value="All">All</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
              <label htmlFor="gender">Gender</label>
            </div>

            <button type='submit' value="Search" className="col-12 col-md-2 fs-5 btn btn-primary">Submit</button>
          </form>
          <div className="row justify-content-between my-3">

            {this.props.selected ?  <button className="col-12 col-md-2 btn mx-3 fs-5 btn-primary" type="button" onClick={() => { this.props.falseSelected()}}>
            Click to Show All Trials</button> : <button className="col-12 col-md-2 btn mx-3 fs-5 btn-primary" type="button" onClick={() => { this.props.trueSelected()}}>
            Click to Show Selected Trials</button>}

            <button className="col-12 col-md-2 fs-5 mx-3 btn btn-primary" type= "button">Next</button>
          </div>
        </div>

       
       
      </div>
    );
  }
}

