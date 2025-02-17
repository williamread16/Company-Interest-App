from flask import Flask, jsonify, request, render_template
from flask_cors import CORS

app = Flask(__name__, template_folder="templates", static_folder="static")
CORS(app)

companies = [] # Initially empty list of companies
notes = {} # Dictionary for notes to be added as values for companies as keys

# Uses index.html template when on the home page
@app.route("/")
def homePage():
    return render_template("index.html")

# Uses the company specific template when on company pages
@app.route("/company/<companyName>")
def companyPage(companyName):
    return render_template("companies.html", companyName=companyName)

# when getCompanies is called in index.js, this function returns a list of companies added
@app.route('/companies', methods=['GET'])
def getCompanies():
    return jsonify({"companies": companies})

# When addCompany is called in index.js, this function takes the input and adds it to the companies list
@app.route('/companies', methods=['POST'])
def addCompany():
    data = request.json
    companyName = data.get("company")

    if companyName and (companyName not in companies):
        companies.append(companyName)
        notes[companyName] = []
        return jsonify({"Message": "addCompany success"})
    return jsonify({"Message": "addCompany failure"})

# When removeCompany is called in index.js, this function removes it from companies list
@app.route('/companies/<string:name>', methods=['DELETE'])
def removeCompany(name):
    if name in companies:
        companies.remove(name)
        del notes[name]
        return jsonify({"Message": "removeCompany success"})
    return jsonify({"Message": "removeCompany failure"})

# getNotes called in companyPage.js: returns list of notes for the company page it is on
@app.route('/api/company/<companyName>', methods=['GET'])
def getNotes(companyName):
    if companyName not in notes:
        return jsonify({"Message": "getNotes failure"})
    return jsonify({"notes": notes[companyName]})

# addNote is called in companyPage.js: takes the input from the text box, creates a new note and appends it to the dictionary as a value of its corresponding company
@app.route('/api/company/<companyName>', methods=['POST'])
def addNote(companyName):
    if companyName not in notes:
        return jsonify({"message": "Company isn't in list"})
    
    data = request.json
    noteContent = data.get("note")
    if not noteContent:
        return jsonify({"message": "Empty Note"})

    notes[companyName].append(noteContent)
    return jsonify({"message": "addNote success"})

#  when removeNote is called in companyPage.js: removes corresponding note from the notes dictionary
@app.route('/api/company/<companyName>/<string:note>', methods=['DELETE'])
def removeNote(companyName, note):
    if companyName in notes and note in notes[companyName]:
        notes[companyName].remove(note)
        return jsonify({"message": "removeNote success"})
    return jsonify({f"message": "removeNot failure"})

if __name__ == "__main__":
    app.run()