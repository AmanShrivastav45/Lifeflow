import React from 'react';

const Modal = ({ show, onHide, hospital, editHospitalDetails }) => {
  if (!show) return null;

  return (
    <div className="modal">
      <h2>Edit Hospital Details</h2>
      <form>
        <label>
          Name:
          <input type="text" value={hospital.name} onChange={(e) => editHospitalDetails({ ...hospital, name: e.target.value })} />
        </label>
        <br />
        <label>
          Email:
          <input type="email" value={hospital.email} onChange={(e) => editHospitalDetails({ ...hospital, email: e.target.value })} />
        </label>
        <br />
        {/* add more fields for other hospital details */}
        <button onClick={onHide}>Save Changes</button>
      </form>
    </div>
  );
};

export default Modal;