import React from "react";
import { sampleClassRef } from "../db";

class CreateFunctionBar extends React.Component {

    render() {
        const activeCollection = this.props.activeCollection || "Select collection";
        const sortBy = this.props.sortBy || "Sort by";
        const activeGroup = this.props.activeGroup || "Select group";
        const groupButtons = [...Array(7).keys()].map((number) => 
            <button className="dropdown-item" key={number} onClick={() => this.props.selectActiveGroup(number)}>Group {number}</button>
        );
        const collectionListItems = this.props.collectionNames.map((name) => 
            <button className="dropdown-item" key={name} onClick={() => this.props.selectActiveCollection(name)}>{name}</button>
        );
        return (
            <nav className="navbar navbar-light navbar-expand-sm bg-light">

            <div className="navbar-nav mr-auto">
                <div className="dropdown mr-2">
                    <a className={` btn btn-secondary dropdown-toggle`} href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {activeCollection}
                    </a>
                    <div className="dropdown-menu">
                        {collectionListItems}
                    </div>
                </div>
                <div className="dropdown mr-2">
                    <a className={` btn btn-secondary dropdown-toggle`} href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {sortBy}
                    </a>
                    <div className="dropdown-menu">
                        <button className="dropdown-item" key={"used"} onClick={() => this.props.selectSortMethod("used")}>Used first</button>
                        <button className="dropdown-item" key={"unused"} onClick={() => this.props.selectSortMethod("unused")}>Unused first</button>
                        <button className="dropdown-item" key={"new"} onClick={() => this.props.selectSortMethod("new")}>New first</button>
                    </div>
                </div>
                <div className="dropdown mr-2">
                    <a className={` btn btn-secondary dropdown-toggle`} href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {activeGroup}
                    </a>
                    <div className="dropdown-menu">
                        {groupButtons}
                    </div>
                </div>
            </div>
            <button className="btn btn-secondary mr-2" href="#" onClick={this.props.finishCollection}>Finish running collection</button>
           </nav>
        )
    }

}

export default CreateFunctionBar;