import Swal from 'sweetalert2';

// Department-designation mapping
export const departmentDesignations = {
  'Development': ['Software Engineer', 'Senior Developer', 'Team Lead'],
  'QA & Automation Testing': ['QA Engineer', 'Automation Engineer', 'Test Lead'],
  'Networking': ['Network Engineer', 'System Administrator'],
  'HR Team': ['HR Executive', 'HR Manager', 'Recruiter'],
  'Security': ['Security Officer', 'Security Analyst'],
  'Sales & Marketing': ['Sales Executive', 'Marketing Manager']
};

// Function to get designations based on department
export const getDesignationsByDepartment = (department) => {
  return departmentDesignations[department] || [];
};

// Function to handle record editing
export const editRecord = (id, navigate) => {
  navigate(`/admin/edit-record?id=${id}`);
};

// Function to handle record deletion with confirmation
export const deleteRecordById = (id, onDelete) => {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      // Call the delete function passed from component
      onDelete(id);
      Swal.fire(
        'Deleted!',
        'Your record has been deleted.',
        'success'
      );
    }
  });
};

// Function to handle approval/rejection with confirmation
export const handleApproval = (id, type, onApprove) => {
  Swal.fire({
    title: 'Are you sure?',
    text: `Do you want to ${type}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes'
  }).then((result) => {
    if (result.isConfirmed) {
      // Call the approve function passed from component
      onApprove(id, type);
      Swal.fire(
        'Success!',
        `Action ${type} completed successfully.`,
        'success'
      );
    }
  });
};

// Function to show success message
export const showSuccessMessage = (title, text) => {
  Swal.fire({
    icon: 'success',
    title: title,
    text: text,
    timer: 2000,
    showConfirmButton: false
  });
};

// Function to show error message
export const showErrorMessage = (title, text) => {
  Swal.fire({
    icon: 'error',
    title: title,
    text: text
  });
};

// Function to format date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Function to format time
export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};
