import "./Rows.css";

const Rows = ({ rows }) => {
  return (
    <div className="rows">
      {rows.map((row) => ( <span key={row}>{row}</span>))}
    </div>
  );
};

export default Rows;
