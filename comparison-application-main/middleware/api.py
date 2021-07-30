import flask
from flask import request, jsonify
from flask_cors import CORS, cross_origin
import requests
import json
from datetime import datetime

app = flask.Flask(__name__)
app.config["DEBUG"] = True
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = False
CORS(app, support_credentials=True)

@app.route('/', methods=['POST'])
@cross_origin(supports_credentials=True)
def home():
    return '''
    <h1>Comparison Backend</h1>
    '''

# Send request to clinical api server and then parse it
def get_trials(keyword):
    # Use keyword to query the API
    key = keyword.split()
    search = ""
    last_ind = len(key) - 1

    for i in range(0, len(key)):
        search = search + key[i]
        if i != last_ind:
            search += "+"
    
    # clinical api server can only send 100 trials per request
    query_string = "https://clinicaltrials.gov/api/query/full_studies?expr=" + search + "&min_rnk=1&max_rnk=30&fmt=json"
    response = requests.get(query_string)

    # only extract useful part in JSON
    full_studies_response = response.json()['FullStudiesResponse']
    try:
        full_studies = full_studies_response['FullStudies']
    except KeyError:
        print("No FullStudies Section")
        return None
    
    return full_studies


# Sort Trials By Criteria Route
@app.route('/api/sortTrialsByCriteria', methods=['POST'])
def api_sortTrialsByCriteria():
    keyword = request.form['keyword']
    criteria = parse_request(request)
    trial_data = get_trials(keyword)

    # if no result from clinical api server, return False to frontend
    if trial_data == None:
        return jsonify(
            status=False,
            message="Cannot search trials"
        )

    apply_sorting_criteria(trial_data, criteria)

    # return number of trials user input
    response = jsonify(
        status=True,
        message="Successfully sorted trials",
        data=trial_data
    )

    # response.headers.add("Access-Control-Allow-Origin", "*")
    return response, 200


# First remomve ongoing trials (we only need completed trials) and then sort it
def apply_sorting_criteria(trial_data, criteria):
    remove = set_up_score(trial_data, criteria)
    remove = remove[::-1]
    for i in remove:
        del trial_data[i]
    sort_trials(trial_data)


# Assign score to all trials
def set_up_score(trial_data, criteria):
    remove = []
    count = 0
    for study in trial_data:
        try:
            protocol_section = study['Study']['ProtocolSection']
        except KeyError:
            print("No Protocol Section")
            continue

        score = 0
        criteriaMatch = {'type':False}
        # First check if trials completed. If not, continue and add the remove list
        try:
            completed_date = protocol_section['StatusModule']['PrimaryCompletionDateStruct']['PrimaryCompletionDate']
            date_list = completed_date.split(' ')
            date_str = ''
            if len(date_list) == 2:
                date_str += date_list[1] + '-' + date_list[0] + '-01'
            else:
                date_str += date_list[2] + '-' + date_list[0] + '-' + date_list[1][:len(date_list[1]) - 1]

            dt = datetime.strptime(date_str, '%Y-%B-%d')
            now_dt = datetime.now()

            if now_dt < dt:
                remove.append(count)
        except KeyError:
            remove.append(count)
            print("No completion date Section")

        # StudyType part
        try:
            study_type = protocol_section['DesignModule']['StudyType']
            study_type = study_type.lower()
            if criteria['type'] == study_type:
                score += criteria['typeWeight']
                criteriaMatch['type'] = True
        except KeyError:
            print("No StudyType Section")

        study.update({'score': score, 'criteriaMatch': json.dumps(criteriaMatch)})
        count += 1
    return remove


# Sort trials from highest score to lowest
def sort_trials(trial_data):
    def score(trial_data):
        try:
            return int(trial_data['score'])
        except KeyError:
            return float('-inf')
    trial_data.sort(key=score, reverse=True)

# Parse user's input from sorting criteria
def parse_request(request):
    result = {
        'type':request.form['type'],
        'typeWeight':1,
    }
    result['type']=result['type'].lower()
    return result

app.run(debug=True, host='0.0.0.0')