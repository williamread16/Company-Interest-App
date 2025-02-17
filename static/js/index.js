const API_URL = "http://127.0.0.1:5000/companies";

// Creates a list of companies from the companies list in logic.py
async function getCompanies() {
    const listElement = document.getElementById("companyList");

    const response = await fetch(API_URL);
    const data = await response.json();
    listElement.innerHTML = "";

    // For each company in companies returned by logic.py, creates a list item and a remove button then appends it all to the list element
    data.companies.forEach(company => {
        const listItem = document.createElement("li");

        const companyLink = document.createElement("a");
        companyLink.href = `/company/${encodeURIComponent(company)}`;
        companyLink.textContent = company;
        companyLink.classList.add("company-link");

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.onclick = () => removeCompany(company);

        listItem.appendChild(companyLink);
        listItem.appendChild(removeButton);
        listElement.appendChild(listItem);
    });
}

// Adds a new company using the input from the text box
window.addCompany = async function () {  
    const company = document.getElementById("companyName").value; // Input
    if (!company) return alert("Enter a company name");
    const response = await fetch(API_URL, {method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ company })}); 

    // If it gets a positive response, reruns getCompanies to update the list of companies
    if (response.ok) {
        document.getElementById("companyName").value = "";
        getCompanies();
    } else {
        alert("Failed to add company");
    }
};

// Removes a company
window.removeCompany = async function (name) {
    const response = await fetch(`${API_URL}/${name}`, { method: "DELETE" });

    // Updates note list by running getCompanies if successful response
    if (response.ok) {
        getCompanies();
    } else {
        alert("Failed to remove company");
    }
};

// Runs getCompanies first to set up the page with any companies already added
getCompanies();