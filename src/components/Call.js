import React from "react";

class Call extends React.Component {

    getStyling() {
        var styling = "";
        var dataTarget = "#exportModal";
        var callStyle;
        if (this.props.draggable) {
            styling = "inherit-rounded";
        } else {
            callStyle = {height: `${this.props.callSize.height}px`, width: `${this.props.callSize.width}px`};
            styling = `btn list-group-item call`;
            if (this.props.empty) {
                styling += " disabled list-group-item-light call-empty";
                dataTarget = "";
            } else if (this.props.disabled) {
                styling += " list-group-item-dark call-disabled";
            } else {
                styling += ` btn-outline-light group-${this.props.group}`;
            }
            if (this.props.snapshot) {
                styling += " call-snapshot";
            } else {
                styling += ` rounded-call ${this.props.rounded}`;
            }
        }

        return {styling, callStyle}
    }

    render() {
        var {styling, callStyle} = this.getStyling();
        var dataTarget = "#exportModal";
        const name = this.props.category === "plus" ? this.props.name + " +" : this.props.name;
        return (
            <li 
            data-toggle="modal" 
            data-target={dataTarget} 
            className={`${styling} d-flex justify-content-center`} 
            style={callStyle}
            id={this.props.name}
            onClick={this.props.onClick}>
                <span className={`${this.props.empty ? "empty" : ""}`}>{name}</span>
            </li>
        )
    }

}

export default Call;
