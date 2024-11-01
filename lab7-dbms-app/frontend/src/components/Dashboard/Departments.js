import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

import Header from "./Header";
import DepartmentEdit from "./DepartmentEdit";
import DepartmentTable from "./DepartmentTable";
import AddDepartment from "./DepartmentAdd";

const DepartmentsDashboard = ({ setIsAuthenticated }) => {
  const [departments, setDepartments] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    //LAB TASK: Add logic to fetch departments here.
    fetch(`http://localhost:3001/api/department/`, {
      method: "GET",
      headers: {
      "Content-Type": "application/json",
      },
      })
      .then((response) => response.json())
      .then((data) => {
      console.log(data.data);
      // Assuming data.data is an array of arrays and you want to sort by the first item of each sub-array
      const sortedData = data.data.sort((a, b) => {
      if (a[0] < b[0]) return -1;
      if (a[0] > b[0]) return 1;
      return 0;
      });
      setDepartments(sortedData);
      })
      .catch((error) => console.error("Error fetching Employees results:",
      error));
  
  
  
  
  }, []);

  const handleEdit = (id) => {
    //LAB TASK OPTIONAL: Add logic to update departments here
  };

  return (
    <div>
      <Header
        setIsAdding={setIsAdding}
        setIsAuthenticated={setIsAuthenticated}
      />
      <div className="container">
        {!isAdding && !isEditing && (
          <>
            <div
              style={{
                display: "flex",
                marginTop: "30px",
                marginBottom: "18px",
              }}
            >
              <h3 style={{ marginRight: "36px" }}>Department View</h3>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <button
                  onClick={() => setIsAdding(true)}
                  style={{
                    color: "#404040",
                    border: "3px solid #404040",
                    backgroundColor: "transparent",
                    borderRadius: "12px",
                  }}
                >
                  Add Department
                </button>
              </div>
            </div>
            <DepartmentTable
              departments={departments}
              handleEdit={handleEdit}
            />
          </>
        )}
        {isAdding && (
          <AddDepartment
            departments={departments}
            setDepartments={setDepartments}
            setIsAdding={setIsAdding}
          />
        )}
        {isEditing && (
          <DepartmentEdit
            departments={departments}
            selectedDepartment={selectedDepartment}
            setDepartments={setDepartments}
            setIsEditing={setIsEditing}
          />
        )}
      </div>
    </div>
  );
};

export default DepartmentsDashboard;
