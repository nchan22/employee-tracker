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
