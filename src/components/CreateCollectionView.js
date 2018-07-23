import React from "react";
import List from "./List";
import Alerts from "./Alerts";
import * as db from "../util/dbfunctions";
import CreateFunctionBar from "./CreateFunctionBar";

class CreateCollectionView extends React.Component {

    state = {
        callList: [],
        collectionList: [],
        alerts: [],
        sessionNames: [],
        templateNames: []
    }

    // Lifecycle methods
    componentDidMount() {
        this.loadAllCalls();
        this.loadTemplateNames();
        if (this.props.activeClass.name) {
            this.loadSessionNames();
        }
    }

    // Async methods
    async loadAllCalls() {
        db.fetchAllCalls().then((allCalls) => {
            allCalls.sort((a, b) => this.compareCalls(a, b));
            this.setState({ callList: allCalls });
        });
    }

    async loadSessionNames() {
        db.fetchSessionNames().then((sessionNames) => { this.setState({ sessionNames }) });
    }

    async loadTemplateNames() {
        db.fetchTemplateNames().then((templateNames) => { this.setState({ templateNames }) });
    }

    async addSession(name) {
        db.fetchSessionCalls(name).then(async (sessionCalls) => {
            const displayData = await db.displayData(sessionCalls);
            displayData.forEach(((call) => {
                this.moveCall(call.name, "collectionList");
            }));
        });
    }

    async addTemplate(name) {
        db.fetchTemplateCalls(name).then(async (templateCalls) => {
            const displayData = await db.displayData(templateCalls);
            displayData.forEach(((call) => {
                this.moveCall(call.name, "collectionList");
            }));
        });
    }

    async saveNewSession(name) {
        if (!name) {
            this.showAlert("alert-warning", "Please name your session");
        } else if (this.state.collectionList.length === 0) {
            this.showAlert("alert-warning", "Please add some calls to your session");
        } else {
            const session = await db.fetchSessionRef(name);
            if (session) {
                this.showAlert("alert-warning", "A session with that name already exists");
            } else {
                const sessionCalls = this.state.collectionList.map((call) => ({ name: call.name, used: false, timestamp: Date.now() }));
                await db.setSession(name, sessionCalls);
                this.showAlert("alert-success", "Session saved");
                this.removeAll();
                this.loadSessionNames();
                return true;
            }
        }
        return false;
    }

    async saveNewTemplate(name) {
        if (!name) {
            this.showAlert("alert-warning", "Please name your template");
        } else if (this.state.collectionList.length === 0) {
            this.showAlert("alert-warning", "Please add some calls to your template");
        } else {
            const template = await db.fetchTemplateRef(name);
            if (template) {
                this.showAlert("alert-warning", "A template with that name already exists");
            } else {
                const templateCalls = this.state.collectionList.map((call) => ({ name: call.name }));
                await db.setTemplate(name, templateCalls);
                this.showAlert("alert-success", "Template saved");
                this.removeAll();
                this.loadTemplateNames();
                return true;
            }
        }
        return false;
    }

    // Helper methods
    compareCalls(a, b) {
        if (a.name < b.name) {
            return -1;
        } else if (a.name > b.name) {
            return 1;
        } else {
            return 0;
        }
    }

    moveCall = (name, destination) => {
        var callList = this.state.callList;
        var collectionList = this.state.collectionList;

        if (destination === "collectionList") {
            const index = callList.findIndex((call) => call.name === name);
            if (index >= 0) {
                collectionList.push(callList[index]);
                callList.splice(index, 1);
            }
        } else {
            const index = collectionList.findIndex((call) => call.name === name);
            if (index >= 0) {
                callList.push(collectionList[index]);
                collectionList.splice(index, 1);
            }
        }
        callList.sort((a, b) => this.compareCalls(a, b));
        collectionList.sort((a, b) => this.compareCalls(a, b));
        this.setState({ callList, collectionList });
    }

    showAlert(type, text) {
        const alerts = [{ type: type, text: text }];
        this.setState({ alerts });
    }

    clearAlerts = () => {
        this.setState({ alerts: [] });
    }

    // Props methods
    addAllUsed = async (e) => {
        e.preventDefault();
        db.fetchByEverUsed(true).then(async (calls) => {
            const displayData = await db.displayData(calls);
            displayData.forEach(((call) => {
                this.moveCall(call.name, "collectionList");
            }));
        })
    }

    removeAll = () => {
        const collectionList = this.state.collectionList.slice(0);
        collectionList.forEach((call) => this.moveCall(call.name, "callList"));
    }

    render() {
        return (
            <div>
                <CreateFunctionBar
                    activeClass={this.props.activeClass.name}
                    addAllUsed={(e) => this.addAllUsed(e)}
                    removeAll={(e) => this.removeAll(e)}
                    saveNewSession={(name) => this.saveNewSession(name)}
                    saveNewTemplate={(name) => this.saveNewTemplate(name)}
                    addSession={(name) => this.addSession(name)}
                    sessionNames={this.state.sessionNames}
                    addTemplate={(name) => this.addTemplate(name)}
                    templateNames={this.state.templateNames}
                />
                <Alerts alerts={this.state.alerts} clearAlerts={() => this.clearAlerts()} />
                <div className="row">
                    <List size="col-md-6" id="callList" columns={2} calls={this.state.callList} onClick={(name) => this.moveCall(name, "collectionList")} />
                    <List size="col-md-6" id="collectionList" columns={2} calls={this.state.collectionList} onClick={(name) => this.moveCall(name, "callList")} />
                </div>
            </div>
        )
    }

}

export default CreateCollectionView;