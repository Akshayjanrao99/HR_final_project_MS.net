import React, { useState } from 'react';
import { getDesignationsByDepartment, showSuccessMessage, showErrorMessage } from './utils/utils';
import { employeeAPI } from './services/api';

function AddEmployee() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    employeeId: '',
    department: '',
    designation: '',
    salary: '',
    address: '',
    contact: '',
    dob: ''
  });

  const [designations, setDesignations] = useState([]);

  const departments = [
    'Development',
    'QA & Automation Testing',
    'Networking',
    'HR Team',
    'Security',
    'Sales & Marketing'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Update designations when department changes
    if (name === 'department') {
      setDesignations(getDesignationsByDepartment(value));
      setFormData(prev => ({ ...prev, designation: '' })); // Reset designation
    }
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Map form data to backend expected format
      const employeeData = {
        employeeName: formData.name,
        email: formData.email,
        department: formData.department,
        designation: formData.designation,
        salary: parseFloat(formData.salary),
        address: formData.address,
        contact: formData.contact,
        dateOfBirth: formData.dob,
        role: 'USER' // Default role
        // Don't send ID for new employees - it will be auto-generated
      };
      
      const response = await employeeAPI.create(employeeData);
      
      if (response.success) {
        let message = 'Employee added successfully!';
        
        // Show generated password info if available
        if (response.generatedPassword && response.loginInfo) {
          message += `\n\nA welcome email with login details has been sent to: ${response.loginInfo.email}`;
          message += `\n\nLogin Details (for your reference):\nEmail: ${response.loginInfo.email}\nEmployee ID: ${response.loginInfo.empId}\nPassword: ${response.generatedPassword}`;
        }
        
        showSuccessMessage('Success!', message);
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          employeeId: '',
          department: '',
          designation: '',
          salary: '',
          address: '',
          contact: '',
          dob: ''
        });
        setDesignations([]);
      }
    } catch (error) {
      console.error('Error adding employee:', error);
      showErrorMessage('Error!', error.message || 'Failed to add employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-4">
      <h2 className="mb-4">Add Employee</h2>
      
      <div className="card shadow">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email *</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="employeeId" className="form-label">Employee ID *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="employeeId"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="contact" className="form-label">Contact Number *</label>
                  <input
                    type="tel"
                    className="form-control"
                    id="contact"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="department" className="form-label">Department *</label>
                  <select
                    className="form-select"
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="designation" className="form-label">Designation *</label>
                  <select
                    className="form-select"
                    id="designation"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    required
                    disabled={!formData.department}
                  >
                    <option value="">Select Designation</option>
                    {designations.map(design => (
                      <option key={design} value={design}>{design}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="salary" className="form-label">Salary *</label>
                  <input
                    type="number"
                    className="form-control"
                    id="salary"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="dob" className="form-label">Date of Birth *</label>
                  <input
                    type="date"
                    className="form-control"
                    id="dob"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>


            <div className="mb-3">
              <label htmlFor="address" className="form-label">Address *</label>
              <textarea
                className="form-control"
                id="address"
                name="address"
                rows="3"
                value={formData.address}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div className="d-flex justify-content-between">
              <button type="button" className="btn btn-secondary" onClick={() => window.history.back()}>
                <i className="fas fa-arrow-left me-2"></i>
                Back
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save me-2"></i>
                    Save Employee
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddEmployee;
