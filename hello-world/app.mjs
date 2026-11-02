
const employees = [
  { id: "1", name: "Rahul", role: "Developer" },
  { id: "2", name: "Priya", role: "Tester" }
];

export const lambdaHandler = async (event) => {
  const method = event.httpMethod;
  const employeeId = event.pathParameters?.id;

  try {
    if (method === "GET") {
      if (employeeId) {
        const employee = employees.find(e => e.id === employeeId);

        return {
          statusCode: employee ? 200 : 404,
          body: JSON.stringify(employee || { message: "Employee not found" })
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify(employees)
      };
    }

    if (method === "POST") {
      const data = JSON.parse(event.body || "{}");

      if (!data.name || !data.role) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: "Name and role are required" })
        };
      }

      const employee = {
        id: String(Date.now()),
        name: data.name,
        role: data.role
      };

      employees.push(employee);

      return {
        statusCode: 201,
        body: JSON.stringify(employee)
      };
    }

    if (method === "PUT") {
      const data = JSON.parse(event.body || "{}");
      const index = employees.findIndex(e => e.id === employeeId);

      if (index === -1) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: "Employee not found" })
        };
      }

      employees[index] = {
        ...employees[index],
        ...data
      };

      return {
        statusCode: 200,
        body: JSON.stringify(employees[index])
      };
    }

    if (method === "DELETE") {
      const index = employees.findIndex(e => e.id === employeeId);

      if (index === -1) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: "Employee not found" })
        };
      }

      const deleted = employees.splice(index, 1);

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Employee deleted",
          employee: deleted[0]
        })
      };
    }

    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method not allowed" })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message })
    };
  }
};
