import './Cols.css'

const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

const Cols = ({cols}) => 
    <div className="cols">
        {cols.map(col => <span key={col}>{letters[col-1]}</span>)}
    </div>

export default Cols;