import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import BootstrapSwitchButton from "bootstrap-switch-button-react/lib/bootstrap-switch-button-react";

class App extends Component {

    state = {
        probabilityText: "",
        probability: -1,
        currentURL: "",
        enabled: true
    };

    constructor(props: any) {
        super(props);
        this.loadTabState = this.loadTabState.bind(this);
        this.sendInitPopUpMessage = this.sendInitPopUpMessage.bind(this);
        this.sendCreateRequestsMessage = this.sendCreateRequestsMessage.bind(this);
        this.sendUpdatePopUpMessage = this.sendUpdatePopUpMessage.bind(this);
        this.enabledChange = this.enabledChange.bind(this);
        this.clearPopUp = this.clearPopUp.bind(this);
    }

    render() {
        return (
            <div className="modal">
                <header className="modal-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    {/*<p>
                        Edit <code>src/App.tsx</code> and save to reload.
                    </p>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
                    </a>*/}
                    <p style={{visibility: this.state.probabilityText ? 'visible' : 'hidden' }}>
                        Article is
                        <a className={this.state.probability <= 20 ? 'App-info' : this.state.probability > 20 && this.state.probability <= 60 ? "App-warning" : "App-error"}> {this.state.probabilityText} </a>
                        Fake!
                    </p>
                    <label className="checkbox-inline">
                        Enabled <BootstrapSwitchButton checked={this.state.enabled} size='sm' onstyle="outline-info" offstyle="outline-primary" onChange={this.enabledChange}/>
                    </label>
                </header>
            </div>
        )
    }

    componentDidMount(){
        chrome.runtime.sendMessage({type: "GET_CURRENT_TAB"}, (tab:any) => {
            this.loadTabState(tab,true);
        });
    }

    loadTabState(tab:any, saveEnabled:boolean){
        // Get previous tab state if exists
        this.sendInitPopUpMessage(tab,saveEnabled);
    }

    sendInitPopUpMessage(tab:any,saveEnabled:boolean){
        // Get previous tab state if exists
        chrome.runtime.sendMessage({type: "INIT_POPUP", tabId: tab.id}, (response) => {
            if (response) {
                this.setState({probabilityText: response.probabilityText});
                this.setState({probability: response.probability});
                this.setState({currentURL: response.url});

                if(saveEnabled)         //Don' t get enabled from response when handle change on toggle button
                    this.setState({enabled: response.enabled});

                //If previous state doesn't exist make request to backend API to create it
                if (this.state.enabled && (this.state.probabilityText == "" || this.state.currentURL != tab.url))
                    this.sendCreateRequestsMessage(tab);

            } else {
                console.error('There was an error on init popup!');
            }
        });
    }

    sendCreateRequestsMessage(tab:any){
        // Create post request to backend API
        chrome.runtime.sendMessage({type: "CREATE_REQUESTS", currentURL: tab.url}, (probability) => {
            if (probability) {
                const probabilityNumber = parseFloat(probability) * 100;
                const probabilityPercentage = probabilityNumber.toString() + " %";

                this.setState({probabilityText: probabilityPercentage});
                this.setState({probability: probabilityNumber});

                this.sendUpdatePopUpMessage(tab, probabilityPercentage, probabilityNumber, this.state.enabled);
            } else {
                console.error('There was an error on create requests!');
            }
        });
    }

    sendUpdatePopUpMessage(tab:any, probabilityPercentage:any, probabilityNumber:any, enabled:any){
        chrome.runtime.sendMessage(
            {
                type: "UPDATE_POPUP",
                tabId: tab.id,
                url: tab.url,
                probabilityText: probabilityPercentage,
                probability: probabilityNumber,
                enabled: enabled
            },
            (response) => {
                if (!response || response !== "OK") {
                    console.error('There was an error on state update!');
                }
            });
    }

    enabledChange(checked: boolean) {
        this.setState({enabled: checked});
        chrome.runtime.sendMessage({type: "GET_CURRENT_TAB"}, (tab: any) => {
            if(checked)
                this.loadTabState(tab, false);
            else
                this.clearPopUp(tab);
        });
    }

    clearPopUp(tab:any){
        this.setState({probabilityText: ""});
        this.setState({probability: -1});
        this.sendUpdatePopUpMessage(tab, "","", this.state.enabled);
    }


}

export default App;

