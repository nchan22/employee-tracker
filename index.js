// menu variable to let users choose an option using inquirer npm
var menu = [
  {
    type: "list",
    name: "menuChoice",
    message: "What would you like to do?",
    choices: [
      "View All Employees",
      "View All Employees by Department",
      // "View All Employees by Manager",
      "Add Employee",
      "Remove Employee",
      "Update Employee Role",
      "Update Employee Manager",
      "View All Roles",
      "Add Role",
      "Remove Role",
      "View All Departments",
      "Add Department",
      "Remove Department",
      "View Department Budget",
      "Exit",
    ],
  },
  {
    type: "input",
    message: "Enter department name: ",
    name: "deptName",
    when: ({ menuChoice }) => menuChoice === "Add Department",
  },
];

console.log("WELCOME TO EMPLOYEE TRACKER!");
mainMenu();

//start application prompt
function mainMenu() {
  inquirer.prompt(menu).then(function (res) {
    switch (res.menuChoice) {
      case "View All Employees":
        displayEmployees();
        break;
      case "View All Employees by Department":
        viewEmployeesDept();
        break;
      case "View All Employees by Manager":
        break;
      case "Add Employee":
        addEmployee();
        break;
      case "Remove Employee":
        removeEmployee();
        break;
      case "Update Employee Role":
        updateEmployeeRole();
        break;
      case "Update Employee Manager":
        updateEmployeeManager();
        break;
      case "View All Roles":
        displayRoles();
        break;
      case "Add Role":
        addRole();
        break;
      case "Remove Role":
        removeRole();
        break;
      case "View All Departments":
        displayDepartments();
        break;
      case "Add Department":
        addDepartment(res.deptName);
        break;
      case "Remove Department":
        removeDepartment();
        break;
      case "View Department Budget":
        viewDepartmentBudget();
        break;
      case "Exit":
        console.log("Closing connection... Goodbye!");
        db.endConnection();
        break;
    }
  });
}

//Calls to get employees and roles. calls to prompt for new employee's info
function addEmployee() {
  db.Employee.getEmployees((managers) => {
    db.Role.getRoles((roles) => {
      promptSelectRole(roles).then(function (roleid) {
        promptForEmployeeinfo(roleid, managers);
      });
    });
  });
}

//Gets all the employees and asks user to select the employee and their manager
function updateEmployeeManager() {
  db.Employee.getEmployees((employees) => {
    console.log("Select an employee");
    promptSelectEmployee(employees).then(function (employeeid) {
      console.log("Select employee's manager");
      promptSelectEmployee(employees).then(function (managerid) {
        db.Employee.updateEmployeeManager(employeeid, managerid, (employee) => {
          mainMenu();
        });
      });
    });
  });
}

//Calls to get employees and roles. Calls to prompt user to select an employee.
//Calls to prompt user to select a  role to update the selected employee's role
//Calls to update employee with employee id and new role id
function updateEmployeeRole() {
  db.Employee.getEmployees((employees) => {
    db.Role.getRoles((roles) => {
      console.log("Select an employee");
      promptSelectEmployee(employees).then(function (employeeid) {
        promptSelectRole(roles).then(function (roleid) {
          db.Employee.updateEmployeeRole(employeeid, roleid, (employee) => {
            mainMenu();
          });
        });
      });
    });
  });
}

//Calls to get all employees and to prompt user to select an employee.
//Calls to remove employee based on the user's employee choice
function removeEmployee() {
  db.Employee.getEmployees((employees) => {
    promptSelectEmployee(employees).then(function (employeeid) {
      db.Employee.removeEmployee(employeeid, (employee) => {
        mainMenu();
      });
    });
  });
}

//Calls to get roles and to prompt user to select a role. Calls to remove role based on the returned role id
function removeRole() {
  db.Role.getRoles((roles) => {
    promptSelectRole(roles).then(function (roleid) {
      db.Role.removeRole(roleid, (role) => {
        mainMenu();
      });
    });
  });
}

//Calls to get department and to prompt user to select a department
//Calls to remove department based on returned department id
function removeDepartment() {
  db.Department.getDepartments((departments) => {
    promptSelectDepartment(departments).then(function (departmentid) {
      db.Department.removeDepartment(departmentid, (department) => {
        mainMenu();
      });
    });
  });
}

//Calls to get roles and prompt user to select a department
//Calls to ask the user for the rest of the new role information
function addRole() {
  db.Department.getDepartments((departments) => {
    promptSelectDepartment(departments).then(function (departmentid) {
      promptRoleInfo(departmentid);
    });
  });
}

//==================================== QUERIES ===================================

//Calls to get and ask user to select a department.
//Queries to select employee info and role info where the role is part of chosen department
function viewEmployeesDept() {
  db.Department.getDepartments((departments) => {
    promptSelectDepartment(departments).then(function (departmentid) {
      db.Employee.getEmployeesByDepartment(departmentid, (employees) => {
        employees = employees.reduce((acc, { id, ...x }) => {
          acc[id] = x;
          return acc;
        }, {});
        console.table(employees);
        mainMenu();
      });
    });
  });
}
