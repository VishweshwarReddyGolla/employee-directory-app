// app.js

let currentPage = 1;
let itemsPerPage = 6;

// Render Employees
function renderEmployees(employeeArray = mockEmployees) {
    const list = document.getElementById("employee-list");
    list.innerHTML = "";

    const start = (currentPage - 1) * itemsPerPage;
    const paginated = employeeArray.slice(start, start + itemsPerPage);

    paginated.forEach(emp => {
        const card = document.createElement("div");
        card.className = "employee-card";
        card.innerHTML = `
            <h3>${emp.firstName} ${emp.lastName}</h3>
            <p>Email: ${emp.email}</p>
            <p>Department: ${emp.department}</p>
            <p>Role: ${emp.role}</p>
            <button onclick="editEmployee(${emp.id})">Edit</button>
            <button onclick="deleteEmployee(${emp.id})">Delete</button>
        `;
        list.appendChild(card);
    });

    document.getElementById("page-info").textContent = `Page ${currentPage}`;
}

// Search, Filter & Sort
function applyFiltersAndSort() {
    const query = document.getElementById("search-input").value.toLowerCase();
    const firstName = document.getElementById("filter-first-name").value.toLowerCase();
    const department = document.getElementById("filter-department").value.toLowerCase();
    const role = document.getElementById("filter-role").value.toLowerCase();
    const sortValue = document.getElementById("sort-select").value;

    let filtered = mockEmployees.filter(emp =>
        (!firstName || emp.firstName.toLowerCase().includes(firstName)) &&
        (!department || emp.department.toLowerCase().includes(department)) &&
        (!role || emp.role.toLowerCase().includes(role)) &&
        (!query || emp.firstName.toLowerCase().includes(query) || emp.lastName.toLowerCase().includes(query) || emp.email.toLowerCase().includes(query))
    );

    if (sortValue === "firstName") {
        filtered.sort((a, b) => a.firstName.localeCompare(b.firstName));
    } else if (sortValue === "department") {
        filtered.sort((a, b) => a.department.localeCompare(b.department));
    }

    renderEmployees(filtered);
}

// Search input event
function handleSearch() {
    currentPage = 1;
    applyFiltersAndSort();
}

// Pagination
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        applyFiltersAndSort();
    }
}

function nextPage() {
    const totalFiltered = filterCurrentData();
    const totalPages = Math.ceil(totalFiltered.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        applyFiltersAndSort();
    }
}

// Change items per page
function changeItemsPerPage() {
    itemsPerPage = parseInt(document.getElementById("items-per-page").value);
    currentPage = 1;
    applyFiltersAndSort();
}

// Reset Filters
function resetFilters() {
    document.getElementById("filter-first-name").value = "";
    document.getElementById("filter-department").value = "";
    document.getElementById("filter-role").value = "";
    document.getElementById("search-input").value = "";
    document.getElementById("sort-select").value = "";
    currentPage = 1;
    renderEmployees();
}

// Filter panel toggle
function toggleFilterPanel() {
    document.getElementById("filter-panel").classList.toggle("hidden");
}

// Add/Edit Form Handling
function openAddEditForm(editId = null) {
    document.getElementById("form-container").classList.remove("hidden");
    document.getElementById("employee-form").reset();
    document.getElementById("emp-id").value = "";

    if (editId) {
        const emp = mockEmployees.find(e => e.id === editId);
        if (!emp) return;
        document.getElementById("emp-id").value = emp.id;
        document.getElementById("first-name").value = emp.firstName;
        document.getElementById("last-name").value = emp.lastName;
        document.getElementById("email").value = emp.email;
        document.getElementById("department").value = emp.department;
        document.getElementById("role").value = emp.role;
    }
}

function saveEmployee(e) {
    e.preventDefault();
    const id = document.getElementById("emp-id").value;
    const newEmployee = {
        id: id ? parseInt(id) : Date.now(),
        firstName: document.getElementById("first-name").value,
        lastName: document.getElementById("last-name").value,
        email: document.getElementById("email").value,
        department: document.getElementById("department").value,
        role: document.getElementById("role").value,
    };

    if (!newEmployee.firstName || !newEmployee.email) {
        alert("First Name and Email are required");
        return;
    }

    if (id) {
        const index = mockEmployees.findIndex(e => e.id === parseInt(id));
        if (index !== -1) mockEmployees[index] = newEmployee;
    } else {
        mockEmployees.push(newEmployee);
    }

    document.getElementById("form-container").classList.add("hidden");
    applyFiltersAndSort();
}

function closeForm() {
    document.getElementById("form-container").classList.add("hidden");
}

function deleteEmployee(id) {
    const index = mockEmployees.findIndex(emp => emp.id === id);
    if (index !== -1) {
        mockEmployees.splice(index, 1);
        applyFiltersAndSort();
    }
}

function editEmployee(id) {
    openAddEditForm(id);
}

// Helper to get filtered data
function filterCurrentData() {
    const query = document.getElementById("search-input").value.toLowerCase();
    return mockEmployees.filter(emp =>
        emp.firstName.toLowerCase().includes(query) ||
        emp.lastName.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query)
    );
}

// Initialize
document.addEventListener("DOMContentLoaded", () => renderEmployees());
