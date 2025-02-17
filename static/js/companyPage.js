// Gets the company name when on the company specific page from the url
function getCompanyName() {
    const pathSegments = window.location.pathname.split("/");
    return pathSegments.length > 2 ? decodeURIComponent(pathSegments[2]) : null;
}

// Creates a list of notes from the notes dictionary in logic.py
async function getNotes() {
    const companyName = getCompanyName();
    const listElement = document.getElementById("noteList");
    const response = await fetch(`http://127.0.0.1:5000/api/company/${companyName}`);
    const data = await response.json();
    listElement.innerHTML = "";

    // For each note in notes returned by logic.py, creates a listItem and a remove button then appends it all to the list element
    data.notes.forEach(note => {
        const listItem = document.createElement("li");
        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.onclick = () => removeNote(note);

        listItem.textContent = note;
        listItem.appendChild(removeButton);
        listElement.appendChild(listItem);
    });
}

// Adds a new note using the input from the text box
window.addNote = async function () {
    const companyName = getCompanyName();
    const noteContent = document.getElementById("note").value; // Input
    if (!noteContent) return alert("Enter a valid note");
    const response = await fetch(`http://127.0.0.1:5000/api/company/${companyName}`, {method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ note: noteContent })});

    // If it gets a positive response, reruns getNotes to update the list of notes
    if (response.ok) {
        document.getElementById("note").value = "";
        getNotes();
    } else {
        alert("Failed to add note");
    }
};

// Removes a note
window.removeNote = async function (note) {
    const companyName = getCompanyName();
    const response = await fetch(`http://127.0.0.1:5000/api/company/${companyName}/${encodeURIComponent(note)}`, {method: "DELETE"});
    // Updates note list by running getNotes if succesfull response
    if (response.ok) {
        getNotes();
    } else {
        alert("Failed to remove note");
    }
};

// Runs getNotes intially to set up the page
getNotes();