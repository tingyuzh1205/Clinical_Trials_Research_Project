
/*sample return from API calls 
{
  "StudyFieldsResponse":{
	"APIVrs":"1.01.03",
	"DataVrs":"2021:07:25 22:17:01.972",
	"Expression":"Clinical Utility Study of a Low-Cost Hand-Held Breast Scanner",
	"NStudiesAvail":384408,
	"NStudiesFound":1,
	"MinRank":1,
	"MaxRank":1,
	"NStudiesReturned":1,
	"FieldList":[
	  "OutcomeMeasurementValue",
	  "PrimaryOutcomeDescription"
	],
	"StudyFields":[
	  {
		"Rank":1,
		"OutcomeMeasurementValue":[
		  "34.3",
		  "80.3",
		  "4",
		  "12",
		  "362",
		  "89",
		  "23"
		],
		"PrimaryOutcomeDescription":[
		  "comparing the calculated the sensitivities or the percentage of true positive breast lesions (based on imaging results) of the iBE and CBE",
		  "comparing the calculated the specificities or the percentage of true negative lesions (based on imaging results) of the iBE and CBE"
		]
	  }
	]
  }
}
*/

import React from 'react';


export default class OutcomeValue extends React.Component {
	constructor(props) {
		super(props);
		this.state = { result: null, loading: true };
	}

	render() {
		return (<div>
			{this.state.loading ? <div className="spinner-border" role="status"><span className="sr-only"></span></div> : null}
			{(this.state.result || []).map((op, index) => {
				return (<li key={this.props.studyid + "_outcome_"+ index}>{op}</li>);
			})}
		</div>);
	}

	componentDidMount() {
		let url1 = "https://clinicaltrials.gov/api/query/study_fields?expr=" + encodeURIComponent(this.props.studyid);
		url1 = url1 + "&fields=" + encodeURIComponent("OutcomeMeasurementValue,PrimaryOutcomeDescription");
		url1 = url1 + "&max_rnk=1&fmt=json";

		fetch(url1)
			.then(res => res.json())
			.then(
			(result) => {		
				let output = [];
				if (!result.StudyFieldsResponse 
					|| !result.StudyFieldsResponse.StudyFields 
					|| result.StudyFieldsResponse.StudyFields.length == 0) {
					//this.setState({ result: "N/A" });
					output.push("N/A");
				}
				else {
					let resultValues = result.StudyFieldsResponse.StudyFields[0].OutcomeMeasurementValue??[];
					let outcomeNumber = result.StudyFieldsResponse.StudyFields[0].PrimaryOutcomeDescription?.length??0;

					//if the result is empty, automatically creat N/A 
					if (resultValues.length != 0) {
						if (resultValues.length % 2 == 0) {
							// if it's divided by 2, it's liekly to be double blind, so we display two vales each row
							for (let i = 0; i < outcomeNumber; i += 2) {
								let first = resultValues[i].toString();
								let second = resultValues[i+1].toString();
								output.push(first+", "+second);
							}
						}
						// not double blind result
						else {
							for (let i = 0; i < outcomeNumber; i += 1) {
								output.push(resultValues[i].toString());
							}
							//console.log("the reuslt is normal" );
						}
					}
					else {
						output.push("N/A");
					}
				}
				this.setState({ result: output, loading: false });
			},
			(error) => {
				this.setState({
					loading: false,
					result: error
				});
        	}
		);
	}
}

/*
import React from 'react';


export default class OutcomeValue extends React.Component{
	constructor(props){
	super(props);
	this.state = {time : "N/A"};
	  }

	render(){
		//console.log(this.props.data);
		let time = "N/A";
		let request = new XMLHttpRequest();
		let name = this.props.data;
		let url1 = "https://clinicaltrials.gov/api/query/study_fields?expr=" +name.replaceAll(' ', '+');
		url1 = url1 +"&fields=OutcomeMeasurementValue&max_rnk=1&fmt=json";
		//console.log(url1);
		request.open("GET",url1);
		request.send();
		request.onload =()=>{
			if (request.status ==200){
			let result = JSON.parse(request.response);
			//console.log(result);
			if(result.StudyFieldsResponse.StudyFields &&
				result.StudyFieldsResponse.StudyFields[0].OutcomeMeasurementValue.length !=0){
				this.setState({time:result.StudyFieldsResponse.StudyFields[0].OutcomeMeasurementValue[0].toString()});
				time = result.StudyFieldsResponse.StudyFields[0].OutcomeMeasurementValue[0].toString();
			}

			}
		}

		//console.log(this.state.time);

		return (<p>{this.state.time}</p>);
	}
}
*/