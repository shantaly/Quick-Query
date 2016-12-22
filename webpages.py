from flask import Flask
from flask import jsonify
from flask import make_response
from flask import render_template
from flask import request
from socket import gethostname
import random
import database
import random

asciiCharset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

app = Flask(__name__)

@app.after_request
def after_request(response):
	response.headers.add('Access-Control-Allow-Origin', '*')
	response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
	response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
	return response

####
###
## Login/logout Redering and Request Handeling
###
####

@app.route('/', methods=['POST', 'GET'])
def indexPage():
	return render_template('index.html')

@app.route('/login')
def loginPage():
	return render_template('login.html')

@app.route('/accounts/logout/<username>', methods=['POST'])
def logout(username):
	userCookie = request.cookies.get(username)
	outcome = database.deleteCookie(username, userCookie)
	if outcome == 'success':
		return jsonify(status=outcome)
	else:
		print 'Bad cookie'
		outcome = 'error_accessDenied'
		return jsonify(status=outcome)

####
###
## Student Redering and Request Handeling
###
####

@app.route('/login/student')
def loginPageS():
	return render_template('loginS.html')

@app.route('/accounts/validateLoginS', methods=['POST'])
def validateLogin1():
	user =  request.form['email']
	password = request.form['password']
	validityString = 'false'

	if request.method == 'OPTIONS':
		return "Access-Control-Allow-Origin: '*'"
	else:
		validityString, name = database.valLogin1(user, password)
		responseObj = make_response(jsonify(valid=validityString, name=name))

		randomCookie = ''

		if validityString == 'true':
			for i in range(0, 7):
				randomCookie = randomCookie + random.choice(asciiCharset)
			print randomCookie
			responseObj.set_cookie(user, randomCookie)

			database.storeCookies(user, randomCookie)

		return responseObj

@app.route('/accounts/<username>/courses', methods=['GET'])
def getStudCourses(username):
	userCookie = request.cookies.get(username)
	print userCookie
	outcome = 'success'

	sessionIsValid = database.validateCookies(username, userCookie)

	if sessionIsValid == 'true':
		courseNs, courseCs = database.getCourses1(username)
		return jsonify(courses=courseNs, courseC=courseCs, status=outcome)
	else:
		print 'Bad cookie'
		outcome = 'error_accessDenied'
		return jsonify(status=outcome)

@app.route('/student/home')
def studentHome():
	return render_template('studentHome.html')

@app.route('/student/course')
def studentCourseView():
	return render_template('studentCourse.html')


@app.route('/accounts/<username>/courses/<courseID>', methods=['GET', 'POST'])
def getStudCourseInfo(username, courseID):
	userCookie = request.cookies.get(username)
	outcome = 'success'

	sessionIsValid = database.validateCookies(username, userCookie)

	if sessionIsValid == 'true':
		weekNum, dataActive, done, grades = database.getCourseInfo1(courseID, username)
		if weekNum != 'null':
			return jsonify(weeks=weekNum, dataActive=dataActive, isDone=done, grades=grades, status=outcome)
		else:
			outcome = 'error_sessions_null'
			return jsonify(status=outcome)
	else:
		print 'Bad cookie'
		outcome = 'error_accessDenied'
		return jsonify(status=outcome)

@app.route('/student/sessions')
def studentCourseSessions():
	return render_template('studentSessions.html')

@app.route('/accounts/<username>/courses/<courseID>/<week>', methods=['GET', 'POST'])
def studentAuthorization(username, courseID, week):
	userCookie = request.cookies.get(username)
	outcome = 'success'

	sessionIsValid = database.validateCookies(username, userCookie)
	inputJsonLib = request.get_json()
	latitude = inputJsonLib['latitude']
	longitude = inputJsonLib['longitude']
	password = inputJsonLib['password']

	if sessionIsValid == 'true':
		outcome = database.validateSessionStart(courseID, week, latitude, longitude, password)
		return jsonify(status=outcome)
	else:
		print 'Bad cookie'
		outcome = 'error_login'
		return jsonify(status=outcome)

@app.route('/accounts/<username>/courses/<courseID>/<week>/getQs', methods=['GET', 'POST'])
def getStudentQuestions(username, courseID, week):
	userCookie = request.cookies.get(username)
	outcome = 'success'

	sessionIsValid = database.validateCookies(username, userCookie)

	if sessionIsValid == 'true':
		ids, questions, a1s, a2s, a3s, a4s, a5s, rightAnss = database.getSessionQuestions1(courseID, week)
		randomA = random.sample(range(0, len(ids)), len(ids))
		print randomA

		if ids != 'null':
			return jsonify(ids=ids, randomA=randomA, questions=questions, a1s=a1s , a2s=a2s , a3s=a3s , a4s=a4s , a5s=a5s, rightAnss=rightAnss, status=outcome)
		else:
			outcome = 'error_questions_null'
			return jsonify(status=outcome)
	else:
		print 'Bad cookie'
		outcome = 'error_accessDenied'
		return jsonify(status=outcome)

@app.route('/accounts/<username>/courses/<courseID>/<week>/submitAnswer', methods=['GET', 'POST'])
def submitStudentQuestion(username, courseID, week):
	userCookie = request.cookies.get(username)
	outcome = 'success'

	sessionIsValid = database.validateCookies(username, userCookie)

	inputJsonLib = request.get_json()

	myAnswer = inputJsonLib['answer']
	flag = inputJsonLib['correct']
	questionID = inputJsonLib['questionID']

	if sessionIsValid == 'true':
		outcome = database.submitAnswer(username, courseID, week, questionID, myAnswer, flag)
		return jsonify(status=outcome)
	else:
		print 'Bad cookie'
		outcome = 'error_accessDenied'
		return jsonify(status=outcome)

@app.route('/accounts/<username>/courses/<courseID>/<week>/setDone', methods=['GET', 'POST'])
def studentFinishSession(username, courseID, week):
	userCookie = request.cookies.get(username)
	outcome = 'success'

	sessionIsValid = database.validateCookies(username, userCookie)
	inputJsonLib = request.get_json()

	grade = inputJsonLib['grade']

	if sessionIsValid == 'true':
		outcome = database.studentParticipated(username, courseID, week, grade)
		return jsonify(status=outcome)
	else:
		print 'Bad cookie'
		outcome = 'error_accessDenied'
		return jsonify(status=outcome)

@app.route('/student/sessions/questions')
def studentSessionQuestions():
	return render_template('studentQuestions.html')

@app.route('/accounts/<username>/courses/<courseID>/grades', methods=['GET', 'POST'])
def getStudCourseGrades1(username, courseID):
	userCookie = request.cookies.get(username)
	outcome = 'success'

	sessionIsValid = database.validateCookies(username, userCookie)

	if sessionIsValid == 'true':
		weeks, grades= database.getCourseGrades1(courseID, username)
		return jsonify(weeks=weeks, grades=grades, status=outcome)
	else:
		print 'Bad cookie'
		outcome = 'error_accessDenied'
		return jsonify(status=outcome)

@app.route('/student/grades')
def studentGrades1():
	return render_template('studentGrades.html')


#@app.route('/student/profile')
#def studentProfile():
#	return render_template('profile.html')


#####
####
## Instructor Redering and Request Handeling
####
#####

@app.route('/login/instructor')
def loginPageT():
	return render_template('loginT.html')

@app.route('/accounts/validateLoginT', methods=['POST'])
def validateLogin2():
	user =  request.form['email']
	password = request.form['password']
	validityString = 'false'

	if request.method == 'OPTIONS':
		return "Access-Control-Allow-Origin: '*'"
	else:
		validityString, name = database.valLogin2(user, password)
		responseObj = make_response(jsonify(valid=validityString, name=name))

		randomCookie = ''

		if validityString == 'true':
			for i in range(0, 7):
				randomCookie = randomCookie + random.choice(asciiCharset)
			print randomCookie
			responseObj.set_cookie(user, randomCookie)

			database.storeCookies(user, randomCookie)

		return responseObj

@app.route('/accounts/<username>/myCourses', methods=['GET'])
def getProfCourses(username):
	userCookie = request.cookies.get(username)
	print userCookie
	outcome = 'success'

	sessionIsValid = database.validateCookies(username, userCookie)

	if sessionIsValid == 'true':
		courseNs, courseCs = database.getCourses2(username)
		return jsonify(courses=courseNs, courseC=courseCs, status=outcome)
	else:
		print 'Bad cookie'
		outcome = 'error_accessDenied'
		return jsonify(status=outcome)

@app.route('/instructor/home')
def instructorHome():
	return render_template('admin.html')

@app.route('/instructor/course')
def instructorCourseView():
	return render_template('course.html')

@app.route('/accounts/<username>/myCourses/<courseID>', methods=['GET', 'POST'])
def getProfCourseInfo(username, courseID):
	userCookie = request.cookies.get(username)
	outcome = 'success'

	sessionIsValid = database.validateCookies(username, userCookie)

	if sessionIsValid == 'true':
		weekNum, dateAdded, active, done = database.getCourseInfo2(courseID)
		if weekNum != 'null':
			return jsonify(weeks=weekNum, dateAdded=dateAdded, isActive=active, isDone=done, status=outcome)
		else:
			outcome = 'error_sessions_null'
			return jsonify(status=outcome)
	else:
		print 'Bad cookie'
		outcome = 'error_accessDenied'
		return jsonify(status=outcome)

@app.route('/accounts/<username>/myCourses/<courseID>/<week>', methods=['GET', 'POST'])
def addNewSession(username, courseID, week):
	userCookie = request.cookies.get(username)
	outcome = 'success'

	sessionIsValid = database.validateCookies(username, userCookie)

	inputJsonLib = request.get_json()
	sessPass = inputJsonLib['password']

	if sessionIsValid == 'true':
		outcome = database.addSession(courseID, week, sessPass)
		return jsonify(status=outcome)
	else:
		print 'Bad cookie'
		outcome = 'error_accessDenied'
		return jsonify(status=outcome)

@app.route('/accounts/<username>/myCourses/<courseID>/<action>/<week>', methods=['GET', 'POST'])
def sessionActions(username, courseID, action, week):
	userCookie = request.cookies.get(username)
	outcome = 'success'

	sessionIsValid = database.validateCookies(username, userCookie)

	if sessionIsValid == 'true':
		inputJsonLib = request.get_json()
		if inputJsonLib != None:
			latitude = inputJsonLib['latitude']
			longitude = inputJsonLib['longitude']
			outcome = database.actionSession(courseID, action, week, latitude, longitude)
			return jsonify(status=outcome)
		else:
			outcome = database.actionSession(courseID, action, week)
			return jsonify(status=outcome)
	else:
		print 'Bad cookie'
		outcome = 'error_accessDenied'
		return jsonify(status=outcome)

@app.route('/instructor/sessions')
def instructorCourseSessions():
	return render_template('sessions.html')

@app.route('/accounts/<username>/myCourses/<courseID>/<week>/getQs', methods=['GET', 'POST'])
def getProfSessionInfo(username, courseID, week):
	userCookie = request.cookies.get(username)
	outcome = 'success'

	sessionIsValid = database.validateCookies(username, userCookie)

	if sessionIsValid == 'true':
		ids, titles, questions, a1s, a2s, a3s, a4s, a5s, rightAnss = database.getSessionQuestions2(courseID, week)
		if ids != 'null':
			return jsonify(ids=ids, titles=titles, questions=questions, a1s=a1s , a2s=a2s , a3s=a3s , a4s=a4s , a5s=a5s, rightAnss=rightAnss, status=outcome)
		else:
			outcome = 'error_questions_null'
			return jsonify(status=outcome)
	else:
		print 'Bad cookie'
		outcome = 'error_accessDenied'
		return jsonify(status=outcome)

@app.route('/accounts/<username>/myCourses/<courseID>/<week>/postQs', methods=['GET', 'POST'])
def addQuestion(username, courseID, week):
	answers = []
	qtitle =  request.form['question_title']
	question = request.form['question']
	ansA = request.form['question_ansA']
	ansB = request.form['question_ansB']
	ansC = request.form['question_ansC']
	ansD = request.form['question_ansD']
	ansE = request.form['question_ansE']
	rightAns = request.form['optionsRadiosInline']
	userCookie = request.cookies.get(username)
	outcome = 'success'

	answers.append(ansA)
	answers.append(ansB)
	if ansC.strip():
		answers.append(ansC)
	if ansD.strip():
		answers.append(ansD)
	if ansE.strip():
		answers.append(ansE)

	sessionIsValid = database.validateCookies(username, userCookie)

	if sessionIsValid == 'true':
		outcome = database.addQuestion(courseID, week, qtitle, question, answers, rightAns)
		return jsonify(status=outcome)
	else:
		print 'Bad cookie'
		outcome = 'error_accessDenied'
		return jsonify(status=outcome)

@app.route('/instructor/sessions/questions')
def instructorSessionQuestions():
	return render_template('questions.html')

@app.route('/accounts/<username>/myCourses/<courseID>/grades', methods=['GET', 'POST'])
def getStudCourseGrades2(username, courseID):
	userCookie = request.cookies.get(username)
	outcome = 'success'

	sessionIsValid = database.validateCookies(username, userCookie)

	if sessionIsValid == 'true':
		studentsIDs, firstName, lastNames, sessionPart, averageMark, weeksCount= database.getCourseGrades2(courseID, username)
		return jsonify(studentsIDs=studentsIDs, firstName=firstName, lastNames=lastNames, sessionPart=sessionPart, averageMark=averageMark, weeksCount=weeksCount, status=outcome)
	else:
		print 'Bad cookie'
		outcome = 'error_accessDenied'
		return jsonify(status=outcome)

@app.route('/instructor/grades')
def studentGrades2():
	return render_template('grades.html')

#@app.route('/instructor/profile')
#def instructorProfile():
#	return render_template('profile.html')

if __name__ == '__main__':
    database.initialize()
    if 'liveconsole' not in gethostname():
        app.run()
