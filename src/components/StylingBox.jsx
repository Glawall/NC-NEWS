import "../StylingBox.css";

function StylingBox (props) {
    const { children } = props;

    return <div className="box">{ children }</div>;
}

export default StylingBox;