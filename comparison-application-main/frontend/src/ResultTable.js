import React from 'react';
import OutcomeValue from './OutcomeValue.js';

// this is the table to display after search by keyword and type

export default class ResultTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = { result: [] };
	}

	renderCri(study) {
		if (!(study.Study.ProtocolSection.EligibilityModule.EligibilityCriteria)) return "N/A";
		let EligibilityCriteria = study.Study.ProtocolSection.EligibilityModule.EligibilityCriteria;
		// get the string representing the EligibilityCriteria and parse it into excluding and including ones
		// split by \n\n will sperate the title from the text

		let array1 = EligibilityCriteria.split("\n\n");
		let inclusion = array1[1];
		let exclusion = array1[3];
		return (
			<div>
				<p>
					<a href="#" className="text-decoration-none" data-bs-toggle="tooltip" data-bs-placement="top"
						title={inclusion}>
						Inclusion
					</a>
				</p>
				<p>
					<a href="#" className="text-decoration-none" data-bs-toggle="tooltip" data-bs-placement="top"
						title={exclusion}>
						Exclusion
					</a>
				</p>
			</div>
		);

	}

	// string method for age 
	renderAge(study) {
		// go through age and return max and min age in string format
		//if no age, display 0-100
		// since the return is in format of string, we parse the string to get the number with string indexing
		let age = "";
		let EligibilityModule = study.Study.ProtocolSection.EligibilityModule;
		if (!(EligibilityModule.MinimumAge)) {
			age = "0 - ";
		}
		else {
			age = age + EligibilityModule.MinimumAge.slice(0, EligibilityModule.MinimumAge.indexOf(" ")) + " - ";
		}
		if (!(EligibilityModule.MaximumAge)) {
			age = age + "100";
		}
		else {
			age = age + EligibilityModule.MaximumAge.slice(0, EligibilityModule.MaximumAge.indexOf(" "));
		}
		return age;
	}

	renderIntervention(study) {
		if (!(study.Study.ProtocolSection.ArmsInterventionsModule)) return "N/A";
		if (!(study.Study.ProtocolSection.ArmsInterventionsModule.InterventionList)) return "N/A";
		let id = study.Study.ProtocolSection.IdentificationModule.NCTId;
		let interList = study.Study.ProtocolSection.ArmsInterventionsModule.InterventionList.Intervention;
		let result = [];
		for (let i = 0; i < interList.length; i++) {
			let name = interList[i].InterventionName;
			let des = interList[i].InterventionDescription;
			let type = interList[i].InterventionType;
			let content = "Descroption: \n" + des + "\n\n" + "Type: \n" + type;
			result.push(<p key={id + "_intervention_" + i}><a href="#" className="text-decoration-none" data-bs-toggle="tooltip" data-bs-placement="top"
				title={content}>{name}</a></p>);
		}
		return result;
	}

	// redner name with link 
	renderName(study) {
		let result = [];
		let id = study.Study.ProtocolSection.IdentificationModule.NCTId;
		let link = "https://clinicaltrials.gov/ct2/show/" + id;
		let name = "";
		if (study.Study.ProtocolSection.IdentificationModule.BriefTitle) {
			name = study.Study.ProtocolSection.IdentificationModule.BriefTitle;
		}
		else {
			name = "N/A";
		}

		return (<a href={link} target="_blank" className="text-decoration-none">{name}</a>);
	}

	// redner outcome with APi request
	renderOutcome(study) {
		if (!(study.Study.ProtocolSection.OutcomesModule)) return "N/A";
		if (!(study.Study.ProtocolSection.OutcomesModule.PrimaryOutcomeList)) return "N/A";
		let id = study.Study.ProtocolSection.IdentificationModule.NCTId
		let outcomeList = study.Study.ProtocolSection.OutcomesModule.PrimaryOutcomeList.PrimaryOutcome;
		let result = [];
		for (let i = 0; i < outcomeList.length; i++) {
			let measure = outcomeList[i].PrimaryOutcomeMeasure;
			let des = outcomeList[i].PrimaryOutcomeDescription;
			let content = "Descroption: \n" + des + "\n";
			result.push(<p key={id + "_outcome_" + i}><a href="#" className="text-decoration-none" data-bs-toggle="tooltip" data-bs-placement="top"
				title={content}>{measure}</a></p>);
		}
		return result;

	}
	// weahter to color a block 
	typeColor(study) {
		let input = this.props.inputData.get('type');
		let type = null;
		if (study.Study.ProtocolSection.DesignModule.StudyType) {
			type = study.Study.ProtocolSection.DesignModule.StudyType;
		}
		// console.log(input);
		// console.log(type);
		// console.log('check' +(input.toLowerCase() == type.toLowerCase()));
		if (input.toLowerCase() == type.toLowerCase()) {
			return 'bg-info';
		}
		else {
			return null;
		}
	}


	ageColor(study) {
		let EligibilityModule = study.Study.ProtocolSection.EligibilityModule;
		let min = 0;
		let max = 100;
		let inputMin = null;
		let inputMax = null;
		if (EligibilityModule.MinimumAge) {
			min = parseInt(EligibilityModule.MinimumAge.slice(0, EligibilityModule.MinimumAge.indexOf(" ")));
		}
		if (EligibilityModule.MaximumAge) {
			max = parseInt(EligibilityModule.MaximumAge.slice(0, EligibilityModule.MaximumAge.indexOf(" ")));
		}
		if (this.props.inputData.get('min') != null && this.props.inputData.get('min').trim() != "") {

			inputMin = parseInt(this.props.inputData.get('min').trim());
		}
		if (this.props.inputData.get('max') != null && this.props.inputData.get('max').trim() != "") {

			inputMax = parseInt(this.props.inputData.get('max').trim());
		}
		// console.log('min' + min);
		// console.log('max' + max);
		// console.log('inputMin' + inputMin);
		// console.log(inputMax);

		if (inputMin == null) {
			if (inputMax && max <= inputMax) {
				return 'bg-info';
			}
			else {
				return null;
			}
		}
		else {
			if (inputMax == null) {
				if (min >= inputMin) {
					return 'bg-info';
				}
				else {
					return null;
				}
			}
			else {
				if (min >= inputMin && max <= inputMax) {
					return 'bg-info';
				}
				else {
					return null;
				}
			}
		}
	}

	genderColor(study) {
		let EligibilityModule = study.Study.ProtocolSection.EligibilityModule;
		let inputGender = this.props.inputData.get('gender').trim().toLowerCase();
		let gender = null;
		if (EligibilityModule.Gender && EligibilityModule.Gender.toLowerCase() == inputGender) {
			return 'bg-info';
		}
		else {
			return null;
		}
	}

	conditionColor(study) {
		if (study.Study.ProtocolSection.ConditionsModule.ConditionList.Condition) {
			let condition = study.Study.ProtocolSection.ConditionsModule.ConditionList.Condition[0].toLowerCase();
			let inputCondition = this.props.inputData.get('condition').trim().toLowerCase();
			if (condition.includes(inputCondition) && inputCondition != "") {
				return 'bg-info';
			}
			else { return null; }

		}
		else {
			return null;
		}
	}

	// main render 
	render() {
		// no result
		if (this.props.data.length == 0 || !(this.props.data)) {
			return (<p key="NoResult"></p>);
		}
		// when we have all the data needed
		else {
			// console.log(this.props.data);
			// checked = {study.select ? true : false}
			return (
				<div className="table-responsive text-center">
					<table className="table table-hover align-middle ">
						<thead>
							<tr>
								<th className="header" scope="col">Trial Name</th>
								<th className="header" scope="col">Select</th>
								<th className="header" scope="col">Type</th>
								<th className="header" scope="col">Condition</th>
								<th className="header" scope="col">Allocation</th>
								<th className="header" scope="col">Age</th>
								<th className="header" scope="col">Gender</th>
								<th className="header" scope="col">Criteria</th>
								<th className="header" scope="col">Treatment</th>
								<th className="header" scope="col">Primary Outcome</th>
								<th className="header" scope="col">OutcomeValue</th>
							</tr>
						</thead>
						<tbody>
							{this.props.data.map(study =>
								<tr key={study.Study.ProtocolSection.IdentificationModule.NCTId}>
									<th scope="row">
										{this.renderName(study)}
									</th>
									<td>
										<p>
											<input className="form-check-input" type="radio"
												value="keep" onChange={() => { this.props.addSelect(study) }}
												name={study.Study.ProtocolSection.IdentificationModule.NCTId} />
											&#10003;</p>

										<p>
											<input className="form-check-input" type="radio"
												value="reject"
												name={study.Study.ProtocolSection.IdentificationModule.NCTId} />
											&#10539;</p>

										<p>
											<input className="form-check-input" type="radio"
												value="pending"
												name={study.Study.ProtocolSection.IdentificationModule.NCTId} />
											&#63;</p>

									</td>
									<td className={this.typeColor(study)}>
										{study.Study.ProtocolSection.DesignModule.StudyType ?
											study.Study.ProtocolSection.DesignModule.StudyType : "N/A"}

									</td>
									<td className={this.conditionColor(study)}>
										{study.Study.ProtocolSection.ConditionsModule.ConditionList.Condition ?
											study.Study.ProtocolSection.ConditionsModule.ConditionList.Condition : "N/A"}
									</td>


									<td>
										{study.Study.ProtocolSection.DesignModule.DesignInfo.DesignAllocation ?
											study.Study.ProtocolSection.DesignModule.DesignInfo.DesignAllocation : "N/A"}
									</td>
									<td className={this.ageColor(study)}>
										{this.renderAge(study)}
									</td>
									<td className={this.genderColor(study)}>
										{study.Study.ProtocolSection.EligibilityModule.Gender ?
											study.Study.ProtocolSection.EligibilityModule.Gender : "N/A"}
									</td>

									<td>
										{this.renderCri(study)}
									</td>
									<td>
										{this.renderIntervention(study)}
									</td>
									<td>
										{this.renderOutcome(study)}
									</td>

									<td>
										<OutcomeValue className="OutcomeValue" studyid=
											{study?.Study?.ProtocolSection?.IdentificationModule?.NCTId}></OutcomeValue>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>

			);
		}
	}
}