import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

    state = {
        probabilityText: "",
        probability: 0,
        currentURL: ""
    };

    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <p>
                        Edit <code>src/App.tsx</code> and save to reload.
                    </p>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
                    </a>
                    <p style={{visibility: this.state.probabilityText ? 'visible' : 'hidden' }}>
                        Article is
                        <a className={this.state.probability <= 20 ? 'App-info' : this.state.probability > 20 && this.state.probability <= 60 ? "App-warning" : "App-error"}> {this.state.probabilityText} </a>
                        Fake!
                    </p>
                </header>
            </div>
        )
    }

    componentDidMount(){
        chrome.runtime.sendMessage({type: "GET_CURRENT_TAB"}, (tab:any) => {
            // Get previous tab state if exists
            chrome.runtime.sendMessage({type: "INIT_POPUP", tabId: tab.id}, (response) => {
                if(response){
                    this.setState({probabilityText: response.probabilityText});
                    this.setState({probability: response.probability});
                }
                else {
                    console.error('There was an error on init popup!');
                }
            });

            // Create post request to backend API
            const currentURL = tab.url
            if(this.state.probabilityText == "" || this.state.currentURL != currentURL) {
                this.setState({currentURL: currentURL});
                chrome.runtime.sendMessage({type: "CREATE_REQUESTS", currentURL: currentURL}, (probability) => {
                    if(probability){
                        const probabilityNumber = parseFloat(probability) * 100;
                        const probabilityPercentage = probabilityNumber.toString() + " %";

                        this.setState({probabilityText: probabilityPercentage});
                        this.setState({probability: probabilityNumber});

                        chrome.runtime.sendMessage(
                            {type: "UPDATE_POPUP", tabId: tab.id, url: tab.url, probabilityText: probabilityPercentage, probability: probabilityNumber},
                            (response) => {
                            if(!response || response !== "OK"){
                                console.error('There was an error on state update!');
                            }
                        });
                    }
                    else {
                        console.error('There was an error on create requests!');
                    }
                });
            }
        });
    }


}

export default App;

