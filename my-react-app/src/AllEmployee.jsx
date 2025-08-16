import React, { useState, useEffect } from 'react';
import { deleteRecordById, editRecord, showErrorMessage } from './utils/utils';
import { useNavigate } from 'react-router-dom';
import { employeeAPI } from './services/api';

function AllEmployee() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');

  const departments = ['Development', 'QA & Automation Testing', 'Networking', 'HR Team', 'Security', 'Sales & Marketing'];

  // Filter employees based on search term and department
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === '' || emp.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleEdit = (id) => {
    editRecord(id, navigate);
  };

  const handleDelete = async (id) => {
    const deleteEmployee = async (empId) => {
      try {
        const response = await employeeAPI.delete(empId);
        if (response.success) {
          setEmployees(employees.filter(emp => emp.id !== empId));
        }
      } catch (error) {
        console.error('Error deleting employee:', error);
        showErrorMessage('Error!', error.message || 'Failed to delete employee');
      }
    };
    deleteRecordById(id, deleteEmployee);
  };

  // Fetch employees from API
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeAPI.getAll();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      showErrorMessage('Error!', 'Failed to fetch employees from database');
      // Fallback to demo data if API fails
      setEmployees([
        {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@company.com',
          employeeId: 'EMP001',
          department: 'Development',
          designation: 'Software Engineer',
          salary: 75000,
          contact: '+1234567890',
          joinDate: '2023-01-15'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Initialize component and fetch data
  useEffect(() => {
    console.log('AllEmployee component mounted');
    fetchEmployees();
  }, []);

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>All Employees</h2>
        <button className="btn btn-primary" onClick={() => navigate('/admin/add-employee')}>
          <i className="fas fa-plus me-2"></i>
          Add Employee
        </button>
      </div>

      {/* Filters */}
      <div className="card shadow mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="search" className="form-label">Search Employees</label>
                <input
                  type="text"
                  className="form-control"
                  id="search"
                  placeholder="Search by name, email, or employee ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="department" className="form-label">Filter by Department</label>
                <select
                  className="form-select"
                  id="department"
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                >
                  <option value="">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Table */}
      <div className="card shadow">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">
            Employee List ({filteredEmployees.length} employees)
          </h6>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-hover" id="employeeTable">
              <thead className="table-dark">
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Contact</th>
                  <th>Salary</th>
                  <th>Join Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" className="text-center py-4">
                      <div className="text-muted">
                        <div className="spinner-border" role="status" aria-hidden="true"></div>
                        <p className="mt-2">Loading employees...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredEmployees.length > 0 ? (
                  filteredEmployees.map(employee => (
                    <tr key={employee.id}>
                      <td className="fw-bold">{employee.employeeId}</td>
                      <td>{employee.name}</td>
                      <td>{employee.email}</td>
                      <td>
                        <span className="badge bg-primary">{employee.department}</span>
                      </td>
                      <td>{employee.designation}</td>
                      <td>{employee.contact}</td>
                      <td>₹{employee.salary ? employee.salary.toLocaleString() : '0'}</td>
                      <td>{new Date(employee.joinDate).toLocaleDateString()}</td>
                      <td>
                        <div className="btn-group" role="group">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEdit(employee.id)}
                            title="Edit Employee"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(employee.id)}
                            title="Delete Employee"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-4">
                      <div className="text-muted">
                        <i className="fas fa-users fa-3x mb-3"></i>
                        <p>No employees found matching your criteria.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="row mt-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <div className="h4 mb-0">{employees.length}</div>
                  <div>Total Employees</div>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-users fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <div className="h4 mb-0">{departments.length}</div>
                  <div>Departments</div>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-building fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <div className="h4 mb-0">{filteredEmployees.length}</div>
                  <div>Filtered Results</div>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-filter fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <div className="h4 mb-0">
                    ₹{employees.length > 0 ? Math.round(employees.reduce((sum, emp) => sum + (emp.salary || 0), 0) / employees.length).toLocaleString() : '0'}
                  </div>
                  <div>Avg. Salary</div>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-rupee-sign fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllEmployee;
