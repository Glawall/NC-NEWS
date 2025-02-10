import "../styling/Confirm.css";

function Confirm({ message, onConfirm, onCancel }) {
  return (
    <div className="confirm-overlay">
      <div className="confirm-box">
        <p>{message}</p>
        <div className="confirm-buttons">
          <button onClick={onConfirm} className="confirm-yes">
            Yes
          </button>
          <button onClick={onCancel} className="confirm-no">
            No
          </button>
        </div>
      </div>
    </div>
  );
}

export default Confirm;
