import MySQLdb
import datetime
import decimal

class DB:
	conn = None
	def connect(self):
		self.conn = MySQLdb.connect(host="aelshant.mysql.pythonanywhere-services.com", user = "aelshant", passwd = "aelshant0836885", db = "aelshant$click4marks")

	def query(self, sql, args=None):
		try:
			cursor = self.conn.cursor()
			cursor.execute(sql, args)
		except (AttributeError, MySQLdb.OperationalError):
			self.connect()
			cursor = self.conn.cursor()
			cursor.execute(sql, args)
		return cursor

	def commit(self, sql, args=None):
		try:
			cursor = self.conn.cursor()
			cursor.execute(sql, args)
			self.conn.commit()
		except (AttributeError, MySQLdb.OperationalError):
			self.connect()
			cursor = self.conn.cursor()
			cursor.execute(sql, args)
			self.conn.commit()
		return cursor

db = DB()

def initialize():
	sql = "DROP TABLE IF EXISTS StudInfo_has_Course"
	cur = db.query(sql)
	sql = "DROP TABLE IF EXISTS StudLogs"
	cur = db.query(sql)
	sql = "DROP TABLE IF EXISTS StudInfo"
	cur = db.query(sql)
	sql = "DROP TABLE IF EXISTS MCQ"
	cur = db.query(sql)
	sql = "DROP TABLE IF EXISTS StudParticipation"
	cur = db.query(sql)
	sql = "DROP TABLE IF EXISTS Sessions"
	cur = db.query(sql)
	sql = "DROP TABLE IF EXISTS Course"
	cur = db.query(sql)
	sql = "DROP TABLE IF EXISTS InstructorInfo"
	cur = db.query(sql)
	sql = "DROP TABLE IF EXISTS Cookies"
	cur = db.query(sql)


	sql = "CREATE TABLE IF NOT EXISTS `InstructorInfo` (`InstructorID` INT NOT NULL, `FirstName` VARCHAR(11) NOT NULL DEFAULT '', `LastName` VARCHAR(11) NOT NULL DEFAULT '', `Email` VARCHAR(40) NOT NULL DEFAULT '', `password` VARCHAR(45) NOT NULL, PRIMARY KEY (`InstructorID`))"
	cur = db.query(sql)
	sql = "CREATE TABLE IF NOT EXISTS `Course` (`CourseID` INT  NOT NULL AUTO_INCREMENT,`CourseName` VARCHAR(50) NOT NULL DEFAULT '',`CourseCode` VARCHAR(11) NOT NULL DEFAULT '',`InstructorID` INT NOT NULL, PRIMARY KEY (`CourseID`), INDEX `fk_Course_InstructorInfo1_idx` (`InstructorID` ASC), CONSTRAINT `fk_Course_InstructorInfo1` FOREIGN KEY (`InstructorID`) REFERENCES `InstructorInfo` (`InstructorID`) ON DELETE NO ACTION ON UPDATE NO ACTION)"
	cur = db.query(sql)
	sql = "CREATE TABLE IF NOT EXISTS `Sessions` ( `WeekID` INT NOT NULL, `DateAdded` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, `Active` TINYINT(1) NOT NULL, `Done` TINYINT(1) NOT NULL, `DateActive` DATETIME NULL DEFAULT NULL, `Password` VARCHAR(45) NOT NULL, `Course_CourseID` INT NOT NULL, `LocLat` DECIMAL(11,9), `LocLong` DECIMAL(12,9) , PRIMARY KEY (`WeekID`, `Course_CourseID`), INDEX `fk_Sessions_Course1_idx` (`Course_CourseID` ASC), CONSTRAINT `fk_Sessions_Course1` FOREIGN KEY (`Course_CourseID`) REFERENCES `Course` (`CourseID`) ON DELETE NO ACTION ON UPDATE NO ACTION)"
	cur = db.query(sql)
	sql = "CREATE TABLE IF NOT EXISTS `StudParticipation` ( `StudID` INT NOT NULL, `Sessions_WeekID` INT NOT NULL, `Sessions_Course_CourseID` INT NOT NULL, `Mark` DECIMAL(5,2) , PRIMARY KEY (`StudID`, `Sessions_WeekID`, `Sessions_Course_CourseID`), INDEX `fk_StudParticipation_Sessions1_idx` (`Sessions_WeekID` ASC, `Sessions_Course_CourseID` ASC), CONSTRAINT `fk_StudParticipation_Sessions1` FOREIGN KEY (`Sessions_WeekID` , `Sessions_Course_CourseID`) REFERENCES `Sessions` (`WeekID` , `Course_CourseID`) ON DELETE NO ACTION ON UPDATE NO ACTION)"
	cur = db.query(sql)
	sql	= "CREATE TABLE IF NOT EXISTS `MCQ` (`QuestionsID` INT NOT NULL, `QuestionTitle` VARCHAR(50) NOT NULL DEFAULT '', `Question` VARCHAR(500) NOT NULL DEFAULT '', `Ans1` VARCHAR(100) NOT NULL DEFAULT '', `Ans2` VARCHAR(100) NOT NULL DEFAULT '', `Ans3` VARCHAR(100) NULL DEFAULT '', `Ans4` VARCHAR(100) NULL DEFAULT '', `Ans5` VARCHAR(100) NULL DEFAULT '', `rightAns` VARCHAR(50) NOT NULL, `Sessions_WeekID` INT(11) NOT NULL, `Sessions_Course_CourseID` INT(11) NOT NULL, PRIMARY KEY (`Sessions_WeekID`, `Sessions_Course_CourseID`, `QuestionsID`), INDEX `fk_MCQ_Sessions1_idx` (`Sessions_WeekID` ASC, `Sessions_Course_CourseID` ASC), CONSTRAINT `fk_MCQ_Sessions1` FOREIGN KEY (`Sessions_WeekID` , `Sessions_Course_CourseID`) REFERENCES `Sessions` (`WeekID` , `Course_CourseID`) ON DELETE NO ACTION ON UPDATE NO ACTION)"
	cur = db.query(sql)
	sql = "CREATE TABLE IF NOT EXISTS `StudInfo` (`StudID` INT  NOT NULL, `FirstName` VARCHAR(11) NOT NULL DEFAULT '', `LastName` VARCHAR(11) NOT NULL DEFAULT '', `Email` VARCHAR(70) NOT NULL DEFAULT '', `MiddleName` VARCHAR(11) NULL DEFAULT NULL, `password` VARCHAR(45) NOT NULL, PRIMARY KEY (`StudID`))"
	cur = db.query(sql)
	sql = "CREATE TABLE IF NOT EXISTS `StudLogs` ( `id` INT NOT NULL AUTO_INCREMENT, `StudID` INT NOT NULL, `Ans` VARCHAR(100) NULL DEFAULT NULL, `DateAdded` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, `Correct` TINYINT(1) NOT NULL, `MCQ_Sessions_WeekID` INT NOT NULL, `MCQ_Sessions_Course_CourseID` INT NOT NULL, `MCQ_QuestionsID` INT NOT NULL, PRIMARY KEY (`id`, `MCQ_Sessions_WeekID`, `MCQ_Sessions_Course_CourseID`, `MCQ_QuestionsID`), INDEX `fk_StudLogs_MCQ1_idx` (`MCQ_Sessions_WeekID` ASC, `MCQ_Sessions_Course_CourseID` ASC, `MCQ_QuestionsID` ASC), CONSTRAINT `fk_StudLogs_MCQ1` FOREIGN KEY (`MCQ_Sessions_WeekID` , `MCQ_Sessions_Course_CourseID` , `MCQ_QuestionsID`) REFERENCES `MCQ` (`Sessions_WeekID` , `Sessions_Course_CourseID` , `QuestionsID`) ON DELETE NO ACTION ON UPDATE NO ACTION)"
	cur = db.query(sql)
	sql = "CREATE TABLE IF NOT EXISTS `Cookies` (Username VARCHAR(40), CookieVal VARCHAR(40))"
	cur = db.query(sql)
	sql = "CREATE TABLE IF NOT EXISTS `StudInfo_has_Course` (`StudInfo_StudID` INT NOT NULL, `Course_CourseID` INT NOT NULL, PRIMARY KEY (`StudInfo_StudID`, `Course_CourseID`), INDEX `fk_StudInfo_has_Course_Course1_idx` (`Course_CourseID` ASC), INDEX `fk_StudInfo_has_Course_StudInfo1_idx` (`StudInfo_StudID` ASC), CONSTRAINT `fk_StudInfo_has_Course_StudInfo1` FOREIGN KEY (`StudInfo_StudID`) REFERENCES `StudInfo` (`StudID`) ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT `fk_StudInfo_has_Course_Course1` FOREIGN KEY (`Course_CourseID`) REFERENCES `Course` (`CourseID`) ON DELETE NO ACTION ON UPDATE NO ACTION)"
	cur = db.query(sql)

	sql = "INSERT INTO InstructorInfo (InstructorID, FirstName, LastName, Email, password) VALUES ('0923632', 'Charlie', 'Obimbo', 'cobimbo@uoguelph.ca', 'theboss')"
	cur = db.commit(sql)

	sql = "INSERT INTO Course (CourseName, CourseCode, InstructorID) VALUES ('Introduction to Programming', 'CIS*1500', '0923632')"
	cur = db.commit(sql)

	sql = "INSERT INTO Course (CourseName, CourseCode, InstructorID) VALUES ('Intermediate Programming', 'CIS*2500', '0923632')"
	cur = db.commit(sql)

	sql = "INSERT INTO StudInfo (StudID, FirstName, LastName, Email, password) VALUES (%s,%s,%s,%s,%s)"
	args = '0836885', 'Ahmed', 'El Shantaly', 'aelshant@mail.uoguelph.ca', '0836885'
	cur = db.commit(sql, args)

	sql = "INSERT INTO StudInfo (StudID, FirstName, LastName, Email, password) VALUES (%s,%s,%s,%s,%s)"
	args = '0123456', 'John', 'Smith', 'testing@uoguelph.ca', 'nochance'
	cur = db.commit(sql, args)


	sql = "SELECT CourseID FROM Course WHERE CourseCode = 'CIS*1500'"
	cur = db.query(sql)
	results = cur.fetchall()
	for row in results:
		courseID1 = row[0]

	sql = "SELECT CourseID FROM Course WHERE CourseCode = 'CIS*2500'"
	cur = db.query(sql)
	results = cur.fetchall()
	for row in results:
		courseID2 = row[0]

	sql = "SELECT StudID FROM StudInfo WHERE Email = 'aelshant@mail.uoguelph.ca'"
	cur = db.query(sql)
	results = cur.fetchall()
	for row in results:
		studID1 = row[0]

	sql = "SELECT StudID FROM StudInfo WHERE Email = 'testing@uoguelph.ca'"
	cur = db.query(sql)
	results = cur.fetchall()
	for row in results:
		studID2 = row[0]


	sql = "INSERT INTO StudInfo_has_Course (StudInfo_StudID, Course_CourseID) VALUES(%s,%s)"
	args = (studID1, courseID1)
	cur = db.commit(sql, args)


	sql = "INSERT INTO StudInfo_has_Course (StudInfo_StudID, Course_CourseID) VALUES(%s,%s)"
	args = (studID1, courseID2)
	cur = db.commit(sql, args)

	sql = "INSERT INTO StudInfo_has_Course (StudInfo_StudID, Course_CourseID) VALUES(%s,%s)"
	args = (studID2, courseID1)
	cur = db.commit(sql, args)


	sql = "INSERT INTO StudInfo_has_Course (StudInfo_StudID, Course_CourseID) VALUES(%s,%s)"
	args = (studID2, courseID2)
	cur = db.commit(sql, args)

	sql = "INSERT INTO Sessions (WeekID, Active, Done, Course_CourseID, Password) VALUES(%s,%s,%s,%s,%s)"
	args = 1, 0, 0, 1, "hello"
	cur = db.commit(sql, args)

	sql = "INSERT INTO MCQ (QuestionsID, QuestionTitle, Question, Ans1, Ans2, rightAns, Sessions_Course_CourseID, Sessions_WeekID) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
	args = 1, "First Question", "What is 40 + 70 * 2 ", "180", "220", "180", 1, 1
	cur = db.commit(sql, args)

	sql = "INSERT INTO MCQ (QuestionsID, QuestionTitle, Question, Ans1, Ans2, Ans3, Ans4, rightAns, Sessions_Course_CourseID, Sessions_WeekID) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
	args = 2, "First Question", "Items bought by a trader for $80 are sold for $100. The profit expressed as a percentage of cost price is ", "2.5%", "20%", "25%", "50%", "25%", 1, 1
	cur = db.commit(sql, args)


def valLogin1(username, password):
	valid = 'false'
	name = ' '
	# Sanitize input
	cleanUsername = str(MySQLdb.escape_string(username))

	sql = "SELECT password FROM StudInfo WHERE Email = '" + cleanUsername + "'"
	cur = db.query(sql)

	if cur.rowcount == 0:
		valid = 'false'
	else:
		rows = cur.fetchall()
		if rows[0][0] == password:
			valid = 'true'
		else:
			valid = 'false'

	if valid == 'true':
		sql = "SELECT FirstName, LastName FROM StudInfo WHERE Email = '" + cleanUsername + "'"
		cur = db.query(sql)
		rows = cur.fetchall()
		name = rows[0][0] + " " + rows[0][1]

	return valid, name

def valLogin2(username, password):
	valid = 'false'
	name = ' '
	# Sanitize input
	cleanUsername = str(MySQLdb.escape_string(username))

	sql = "SELECT password FROM InstructorInfo WHERE Email = '" + cleanUsername + "'"
	cur = db.query(sql)

	if cur.rowcount == 0:
		valid = 'false'
	else:
		rows = cur.fetchall()
		if rows[0][0] == password:
			valid = 'true'
		else:
			valid = 'false'

	if valid == 'true':
		sql = "SELECT FirstName, LastName FROM InstructorInfo WHERE Email = '" + cleanUsername + "'"
		cur = db.query(sql)
		rows = cur.fetchall()
		name = rows[0][0] + " " + rows[0][1]

	return valid, name

def storeCookies(username, cookieVal):
	cleanUsername = str(MySQLdb.escape_string(username))
	cleanCookie = str(MySQLdb.escape_string(cookieVal))

	sql = "SELECT * FROM Cookies WHERE Username = '" + cleanUsername + "'"
	cur = db.query(sql)
	if cur.rowcount > 0:
		sql = "DELETE FROM Cookies WHERE Username = '" + cleanUsername + "'"
		cur = db.commit(sql)

	sql = "INSERT INTO Cookies (Username, CookieVal) VALUES ('" + cleanUsername + "', '" + cleanCookie + "')"
	cur = db.commit(sql)

def validateCookies(username, cookieVal):
	validString = 'false'

	if (username == None) or (cookieVal == None):
		return validString

	cleanUsername = str(MySQLdb.escape_string(username))
	cleanCookie = str(MySQLdb.escape_string(cookieVal))

	sql = "SELECT CookieVal FROM Cookies WHERE Username = '" + cleanUsername + "'"
	cur = db.query(sql)
	if cur.rowcount > 0:
		for i in cur.fetchall():
			if i[0] == cleanCookie:
				validString = 'true'

	else:
		validString = 'false'

	return validString

def deleteCookie(username, cookieVal):
	cleanUsername = str(MySQLdb.escape_string(username))
	cleanCookie = str(MySQLdb.escape_string(cookieVal))

	sql = "DELETE FROM Cookies WHERE Username = '" + cleanUsername + "'"
	cur = db.commit(sql)

	sql = "DELETE FROM Cookies WHERE CookieVal = '" + cleanCookie + "'"
	cur = db.commit(sql)

	return 'success'

def getCourses1(username):
	courseCode = []
	courseNames = []
	cleanUsername = str(MySQLdb.escape_string(username))

	sql = "SELECT StudID FROM StudInfo WHERE Email = '" + cleanUsername + "'"
	cur = db.query(sql)

	if cur.rowcount == 1:
		rows = cur.fetchall()
		studID = rows[0][0]

	clean = str(studID)
	sql = "SELECT Course_CourseID FROM StudInfo_has_Course WHERE StudInfo_StudID = '" + clean + "'"
	cur = db.query(sql)

	if cur.rowcount > 0:
		for row in cur.fetchall():
			sql = "SELECT CourseName, CourseCode FROM Course WHERE CourseID = %s"
			args = str(row[0])
			curr = db.query(sql, args)

			for roww in curr.fetchall():
				courseNames.append(roww[0])
				courseCode.append(roww[1])

		return courseNames, courseCode
	else:

		return 'null'

def getCourses2(username):
	courseNames = []
	courseCode = []
	cleanUsername = str(MySQLdb.escape_string(username))

	sql = "SELECT InstructorID FROM InstructorInfo WHERE Email = '" + cleanUsername + "'"
	cur = db.query(sql)

	if cur.rowcount == 1:
		rows = cur.fetchall()
		profID = rows[0][0]

	clean = str(profID)

	sql = "SELECT CourseName, CourseCode FROM Course WHERE InstructorID = '" + clean + "'"
	cur = db.query(sql)


	if cur.rowcount > 0:
		for row in cur.fetchall():
			courseNames.append(row[0])
			courseCode.append(row[1])

		return courseNames, courseCode
	else:

		return 'null'

def getCourseInfo1(courseCode, username):
	weekNum = []
	dateAdded = []
	active = []
	done = []
	grades = []

	cleanCourseCode = str(MySQLdb.escape_string(courseCode))
	cleanUsername = str(MySQLdb.escape_string(username))

	sql = "SELECT StudID FROM StudInfo WHERE Email = '" + cleanUsername + "'"
	cur = db.query(sql)

	if cur.rowcount == 1:
		rows = cur.fetchall()
		studID = rows[0][0]

	sql = "SELECT CourseID FROM Course WHERE CourseCode = '" + cleanCourseCode + "'"
	cur = db.query(sql)

	results = cur.fetchall()
	for row in results:
		courseID = row[0]

	clean = str(courseID)

	sql = "SELECT WeekID, DateActive, Done FROM Sessions WHERE Course_CourseID = '" + clean + "' AND Active = 1"
	cur = db.query(sql)

	if cur.rowcount > 0:
		for row in cur.fetchall():
			weekNum.append(row[0])
			dateAdded.append(row[1])
			sql = "SELECT * FROM StudParticipation WHERE Sessions_WeekID=%s AND Sessions_Course_CourseID=%s AND StudID=%s"
			args = row[0], clean, studID
			curr = db.query(sql, args)

			if curr.rowcount > 0:
				rows = curr.fetchall()
				done.append(1)
				grades.append(str(rows[0][3]))
			else:
				done.append(row[2])
				grades.append(0)

		return weekNum, dateAdded, done, grades
	else:
		return 'null', 'null', 'null', 'null'

def getCourseInfo2(courseCode):
	weekNum = []
	dateAdded = []
	active = []
	done = []

	cleanCourseCode = str(MySQLdb.escape_string(courseCode))

	sql = "SELECT CourseID FROM Course WHERE CourseCode = '" + cleanCourseCode + "'"
	cur = db.query(sql)

	results = cur.fetchall()
	for row in results:
		courseID = row[0]

	clean = str(courseID)
	sql = "SELECT WeekID, DateAdded, Active, Done FROM Sessions WHERE Course_CourseID = '" + clean + "'"
	cur = db.query(sql)

	if cur.rowcount > 0:
		for row in cur.fetchall():
			weekNum.append(row[0])
			dateAdded.append(row[1])
			active.append(row[2])
			done.append(row[3])

		return weekNum, dateAdded, active, done
	else:

		return 'null', 'null', 'null', 'null'

def addSession(courseCode, week, sessPass):
	cleanWeek = str(MySQLdb.escape_string(week))
	cleanCourseCode = str(MySQLdb.escape_string(courseCode))
	cleanSessPass = str(MySQLdb.escape_string(sessPass))
	sql = "SELECT CourseID FROM Course WHERE CourseCode = '" + cleanCourseCode + "'"
	cur = db.query(sql)

	results = cur.fetchall()
	for row in results:
		courseID = row[0]

	clean = str(courseID)

	sql = "SELECT * FROM Sessions WHERE Course_CourseID=%s AND WeekID=%s"
	args = (clean, cleanWeek)
	cur = db.query(sql, args)

	if cur.rowcount == 0:
		sql = "INSERT INTO Sessions (WeekID, Active, Done, Course_CourseID, Password) VALUES(%s,%s,%s,%s,%s)"
		args = (week, 0, 0, courseID, cleanSessPass)
		cur = db.commit(sql, args)
		return 'success'
	else:
		return 'error_exists'

def actionSession(courseCode, action, week, latitude=None, longitude=None):

	cleanWeek = str(MySQLdb.escape_string(week))
	cleanCourseCode = str(MySQLdb.escape_string(courseCode))
	sql = "SELECT CourseID FROM Course WHERE CourseCode = '" + cleanCourseCode + "'"
	cur = db.query(sql)
	results = cur.fetchall()
	for row in results:
		courseID = row[0]

	clean = str(courseID)

	if action == 'activate':
		convertDate = str(datetime.datetime.now())
		date = convertDate.split('.', 1)[0]
		latitudeD = decimal.Decimal(latitude)
		longitudeD = decimal.Decimal(longitude)
		sql = "UPDATE Sessions SET Active=%s, DateActive=%s, LocLat=%s, LocLong=%s WHERE Course_CourseID=%s AND WeekID=%s"
		args = 1, date, latitudeD, longitudeD, clean, cleanWeek
		cur = db.commit(sql, args)

	elif action == 'deactivate':
		sql = "UPDATE Sessions SET Active=%s, DateActive= NULL, LocLat=NULL, LocLong=NULL WHERE Course_CourseID=%s AND WeekID=%s"
		args = (0, clean, week)
		cur = db.commit(sql, args)

	elif action == 'mark1':
		sql = "UPDATE Sessions SET Active=%s, Done=%s WHERE Course_CourseID=%s AND WeekID=%s"
		args = (1, 1,clean, week)
		cur = db.commit(sql, args)

	elif action == 'mark2':
		sql = "UPDATE Sessions SET Active=%s, Done=%s WHERE Course_CourseID=%s AND WeekID=%s"
		args = (0, 0,clean, week)
		cur = db.commit(sql, args)

	elif action == 'delete':
		sql = "DELETE FROM MCQ WHERE Sessions_Course_CourseID=%s AND Sessions_WeekID=%s"
		args = (clean, week)
		cur = db.commit(sql, args)
		sql = "DELETE FROM Sessions WHERE Course_CourseID=%s AND WeekID=%s"
		args = (clean, week)
		cur = db.commit(sql, args)

	return action

def validateSessionStart(courseCode, week, latitude, longitude, password):
	cleanWeek = str(MySQLdb.escape_string(week))
	cleanCourseCode = str(MySQLdb.escape_string(courseCode))
	cleanPassword = str(MySQLdb.escape_string(password))
	latitudeD = decimal.Decimal(latitude)
	longitudeD = decimal.Decimal(longitude)

	check = 0

	sql = "SELECT CourseID FROM Course WHERE CourseCode = '" + cleanCourseCode + "'"
	cur = db.query(sql)
	results = cur.fetchall()
	for row in results:
		courseID = row[0]
	clean = str(courseID)


	sql = "SELECT Password, LocLat, LocLong FROM Sessions WHERE Course_CourseID=%s AND WeekID=%s"
	args = clean, cleanWeek
	cur = db.commit(sql, args)

	for row in cur.fetchall():
		profPass = row[0]
		profLat = row[1]
		profLong = row[2]

	difLat = abs(profLat - latitudeD)
	difLong = abs(profLong - longitudeD)
	print difLat, difLong

	if profPass != cleanPassword:
		check = 1
	print profPass
	print cleanPassword
	#if difLat > 0.0001:
	#	check = 1
	#if difLong > 0.0001:
	#	check = 1

	if check == 1:
		return 'error_accessDenied'
	else:
		return 'success'


def getSessionQuestions1(courseCode, week):
	cleanWeek = str(MySQLdb.escape_string(week))
	ids = []
	questions = []
	a1s = []
	a2s = []
	a3s = []
	a4s = []
	a5s = []
	rightAnss = []

	cleanCourseCode = str(MySQLdb.escape_string(courseCode))

	sql = "SELECT CourseID FROM Course WHERE CourseCode = '" + cleanCourseCode + "'"
	cur = db.query(sql)

	results = cur.fetchall()
	for row in results:
		courseID = row[0]

	clean = str(courseID)

	sql = "SELECT Done FROM Sessions WHERE Course_CourseID=%s AND WeekID=%s"
	args = clean, cleanWeek
	cur = db.query(sql, args)

	results = cur.fetchall()
	for row in results:
		done = row[0]

	if done == 1:
		return 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null'

	sql = "SELECT * FROM MCQ WHERE Sessions_Course_CourseID = '" + clean + "' AND Sessions_WeekID = '" + cleanWeek + "'"
	cur = db.query(sql)


	if cur.rowcount > 0:
		for row in cur.fetchall():
			ids.append(row[0])
			questions.append(row[2])
			a1s.append(row[3])
			a2s.append(row[4])
			a3s.append(row[5])
			a4s.append(row[6])
			a5s.append(row[7])
			rightAnss.append(row[8])

		return ids, questions, a1s, a2s, a3s, a4s, a5s, rightAnss
	else:

		return 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null'

def studentParticipated(username, courseCode, week, grade):
	cleanUsername = str(MySQLdb.escape_string(username))
	cleanWeek = str(MySQLdb.escape_string(week))
	cleanCourseCode = str(MySQLdb.escape_string(courseCode))
	cleanGrade = decimal.Decimal(grade)
	sql = "SELECT StudID FROM StudInfo WHERE Email = '" + cleanUsername + "'"
	cur = db.query(sql)

	if cur.rowcount == 1:
		rows = cur.fetchall()
		studID = rows[0][0]
	cleanStudID = str(studID);

	sql = "SELECT CourseID FROM Course WHERE CourseCode = '" + cleanCourseCode + "'"
	cur = db.query(sql)
	results = cur.fetchall()
	for row in results:
		courseID = row[0]
	cleanCourseID = str(courseID)

	sql = "INSERT INTO StudParticipation (StudID, Sessions_WeekID, Sessions_Course_CourseID, Mark) VALUES (%s, %s, %s, %s)"
	args = cleanStudID, cleanWeek, cleanCourseID, cleanGrade
	cur = db.commit(sql, args)

	return 'success'

def getCourseGrades1(courseCode, username):
	weeks = []
	marks = []
	cleanUsername = str(MySQLdb.escape_string(username))
	cleanCourseCode = str(MySQLdb.escape_string(courseCode))

	sql = "SELECT StudID FROM StudInfo WHERE Email = '" + cleanUsername + "'"
	cur = db.query(sql)
	if cur.rowcount == 1:
		rows = cur.fetchall()
		studID = rows[0][0]
	cleanStudID = str(studID);

	sql = "SELECT CourseID FROM Course WHERE CourseCode = '" + cleanCourseCode + "'"
	cur = db.query(sql)
	results = cur.fetchall()
	for row in results:
		courseID = row[0]
	cleanCourseID = str(courseID)

	sql = "SELECT WeekID FROM Sessions WHERE Course_CourseID = '" + cleanCourseID + "' AND Done = 1"
	cur = db.query(sql)
	results = cur.fetchall()
	for row in results:
		weeks.append(row[0])

	for x in weeks:
		sql = "SELECT Mark FROM StudParticipation WHERE StudID=%s AND Sessions_WeekID=%s AND Sessions_Course_CourseID=%s"
		args = cleanStudID, x, cleanCourseID
		cur = db.commit(sql, args)

		if cur.rowcount == 0:
			marks.append(0);
		else:
			rows = cur.fetchall()
			marks.append(str(rows[0][0]))

	return weeks, marks

def getCourseGrades2(courseCode, username):
	cleanUsername = str(MySQLdb.escape_string(username))
	cleanCourseCode = str(MySQLdb.escape_string(courseCode))
	studentsIDs = []
	sessionPart = []
	averageMark = []
	firstName = []
	lastNames = []

	sql = "SELECT CourseID FROM Course WHERE CourseCode = '" + cleanCourseCode + "'"
	cur = db.query(sql)
	results = cur.fetchall()
	for row in results:
		courseID = row[0]
	cleanCourseID = str(courseID)

	sql = "SELECT StudInfo_StudID FROM StudInfo_has_Course WHERE Course_CourseID = '" + cleanCourseID + "'"
	cur = db.query(sql)
	results = cur.fetchall()
	for row in results:
		studentsIDs.append(row[0])

	sql = "SELECT WeekID FROM Sessions WHERE Course_CourseID = '" + cleanCourseID + "' AND Done = 1"
	cur = db.query(sql)
	weeksCount = cur.rowcount


	for stud_ID in studentsIDs:
		participatedNum = 0
		total = 0
		average = 0
		sql = "SELECT Mark FROM StudParticipation WHERE StudID=%s AND Sessions_Course_CourseID=%s"
		args = stud_ID, cleanCourseID
		cur = db.query(sql, args)
		participatedNum = cur.rowcount
		if participatedNum > 0:
			results = cur.fetchall()
			for row in results:
				total += row[0];
			average = total/participatedNum
		sessionPart.append(participatedNum)
		averageMark.append(str(average))
		cleanStud_ID = str(stud_ID)

		sql = "SELECT FirstName, LastName FROM StudInfo WHERE StudID='" + cleanStud_ID + "'"
		cur = db.query(sql)

		results = cur.fetchall()
		for row in results:
			firstName.append(row[0])
			lastNames.append(row[1])

	return studentsIDs, firstName, lastNames, sessionPart, averageMark, weeksCount

def getSessionQuestions2(courseCode, week):
	cleanWeek = str(MySQLdb.escape_string(week))
	ids = []
	titles = []
	questions = []
	a1s = []
	a2s = []
	a3s = []
	a4s = []
	a5s = []
	rightAnss = []

	cleanCourseCode = str(MySQLdb.escape_string(courseCode))

	sql = "SELECT CourseID FROM Course WHERE CourseCode = '" + cleanCourseCode + "'"
	cur = db.query(sql)

	results = cur.fetchall()
	for row in results:
		courseID = row[0]

	clean = str(courseID)
	sql = "SELECT * FROM MCQ WHERE Sessions_Course_CourseID = '" + clean + "' AND Sessions_WeekID = '" + cleanWeek + "'"
	cur = db.query(sql)


	if cur.rowcount > 0:
		for row in cur.fetchall():
			ids.append(row[0])
			titles.append(row[1])
			questions.append(row[2])
			a1s.append(row[3])
			a2s.append(row[4])
			a3s.append(row[5])
			a4s.append(row[6])
			a5s.append(row[7])
			rightAnss.append(row[8])

		return ids, titles, questions, a1s, a2s, a3s, a4s, a5s, rightAnss
	else:

		return 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null'

def addQuestion(courseCode, week, title, question, answers, rightAns):
	cleanWeek = str(MySQLdb.escape_string(week))
	cleanCourseCode = str(MySQLdb.escape_string(courseCode))
	cleanTitle = str(MySQLdb.escape_string(title))
	cleanQuestion = str(MySQLdb.escape_string(question))
	cleanAnsA = str(MySQLdb.escape_string(answers[0]))
	cleanAnsB = str(MySQLdb.escape_string(answers[1]))
	cleanRightAns = str(MySQLdb.escape_string(answers[int(rightAns)-1]))
	answersSize = len(answers)
	quesID = 0


	sql = "SELECT CourseID FROM Course WHERE CourseCode = '" + cleanCourseCode + "'"
	cur = db.query(sql)

	results = cur.fetchall()
	for row in results:
		courseID = row[0]

	clean = str(courseID)

	sql = "SELECT QuestionsID FROM MCQ WHERE Sessions_Course_CourseID = '" + clean + "' AND Sessions_WeekID = '" + cleanWeek + "'"
	cur = db.query(sql)

	results = cur.fetchall()
	for row in results:
		quesID = row[0]

	quesID = quesID + 1

	cleanQuesID = str(quesID)

	if answersSize == 2:
		sql = "INSERT INTO MCQ (QuestionsID, QuestionTitle, Question, Ans1, Ans2, rightAns, Sessions_Course_CourseID, Sessions_WeekID) VALUES ('" + cleanQuesID + "', '" + cleanTitle + "', '" + cleanQuestion + "', '" + cleanAnsA + "', '" + cleanAnsB + "', '" + cleanRightAns + "', '" + clean + "', '" + cleanWeek + "')"
		cur = db.commit(sql)

		return 'success'
	elif answersSize == 3:
		cleanAnsC = str(MySQLdb.escape_string(answers[2]))
		sql = "INSERT INTO MCQ (QuestionsID, QuestionTitle, Question, Ans1, Ans2, Ans3, rightAns, Sessions_Course_CourseID, Sessions_WeekID) VALUES ('" + cleanQuesID + "', '" + cleanTitle + "', '" + cleanQuestion + "', '" + cleanAnsA + "', '" + cleanAnsB + "', '" + cleanAnsC + "', '" + cleanRightAns + "', '" + clean + "', '" + cleanWeek + "')"
		cur = db.commit(sql)

		return 'success'
	elif answersSize == 4:
		cleanAnsC = str(MySQLdb.escape_string(answers[2]))
		cleanAnsD = str(MySQLdb.escape_string(answers[3]))
		sql = "INSERT INTO MCQ (QuestionsID, QuestionTitle, Question, Ans1, Ans2, Ans3, Ans4, rightAns, Sessions_Course_CourseID, Sessions_WeekID) VALUES ('" + cleanQuesID + "', '" + cleanTitle + "', '" + cleanQuestion + "', '" + cleanAnsA + "', '" + cleanAnsB + "', '" + cleanAnsC + "', '" + cleanAnsD + "', '" + cleanRightAns + "', '" + clean + "', '" + cleanWeek + "')"
		cur = db.commit(sql)


		return 'success'
	elif answersSize == 5:
		cleanAnsC = str(MySQLdb.escape_string(answers[2]))
		cleanAnsD = str(MySQLdb.escape_string(answers[3]))
		cleanAnsE = str(MySQLdb.escape_string(answers[4]))
		sql = "INSERT INTO MCQ (QuestionsID, QuestionTitle, Question, Ans1, Ans2, Ans3, Ans4, Ans5, rightAns, Sessions_Course_CourseID, Sessions_WeekID) VALUES ('" + cleanQuesID + "', '" + cleanTitle + "', '" + cleanQuestion + "', '" + cleanAnsA + "', '" + cleanAnsB + "', '" + cleanAnsC + "', '" + cleanAnsD + "', '" + cleanAnsE + "', '" + cleanRightAns + "', '" + clean + "', '" + cleanWeek + "')"
		cur = db.commit(sql)

		return 'success'

	else:

		return 'error_exists'
	return 'error_exists'

def submitAnswer(username, courseCode, week, questionID, myAnswer, flag):
	cleanUsername = str(MySQLdb.escape_string(username))
	cleanCourseCode = str(MySQLdb.escape_string(courseCode))
	cleanWeek = str(MySQLdb.escape_string(week))
	cleanQuestionID = str(MySQLdb.escape_string(questionID))
	cleanMyAnswer = str(MySQLdb.escape_string(myAnswer))
	cleanFlag = str(MySQLdb.escape_string(flag))

	sql = "SELECT StudID FROM StudInfo WHERE Email = '" + cleanUsername + "'"
	cur = db.query(sql)

	if cur.rowcount == 1:
		rows = cur.fetchall()
		studID = rows[0][0]
	cleanStudID = str(studID)
	sql = "SELECT CourseID FROM Course WHERE CourseCode = '" + cleanCourseCode + "'"
	cur = db.query(sql)

	results = cur.fetchall()
	for row in results:
		courseID = row[0]
	cleanCourseID =str(courseID)

	if cleanFlag == "true":
		flag = 1;
	else:
		flag = 0;

	sql = "INSERT INTO StudLogs (StudID, Ans, Correct, MCQ_Sessions_WeekID, MCQ_Sessions_Course_CourseID, MCQ_QuestionsID) VALUES (%s, %s, %s, %s, %s, %s)"
	args = (cleanStudID, cleanMyAnswer, flag, cleanWeek, cleanCourseID, cleanQuestionID)
	cur = db.commit(sql, args)

	return 'success'




