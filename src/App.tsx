import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import BootstrapSwitchButton from 'bootstrap-switch-button-react/lib/bootstrap-switch-button-react';
import {ExclamationTriangleFill} from 'react-bootstrap-icons';
import Card from 'react-bootstrap/cjs/Card';
import Row from "react-bootstrap/cjs/Row";
import Col from "react-bootstrap/cjs/Col";

class App extends Component {

    state = {
        probabilityText: "",
        probability: -1,
        currentURL: "",
        currentArticle: {title: "", text: ""},
        currentWebsite: "",
        currentPage: "",
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
        this.setCurrentPageAndWebsite = this.setCurrentPageAndWebsite.bind(this);
    }

    render() {
        let body;
        if(this.state.enabled){
            let webSiteText = <Card.Text style={{visibility: this.state.currentWebsite ? 'visible' : 'hidden' }}>
                <p className="row-cols-1">
                    <h6 className="font-weight-bold">Website: </h6> {this.state.currentWebsite}
                </p>
                <p>
                    <h6 className="font-weight-bold">Page: </h6> {this.state.currentPage}
                </p>
            </Card.Text>
            let resultText;
            if(this.state.probabilityText){
                resultText =  <Card.Text>
                    <p>
                        Article <b>{this.state.currentArticle.title}</b> is
                        <a className={"font-weight-bold " + (this.state.probability <= 30 ? "text-success text" : this.state.probability > 30 && this.state.probability <= 60 ? "text-warning" : "text-danger")}> {this.state.probabilityText} </a>
                        Fake!
                    </p>
                </Card.Text>
            }
            else {
                resultText = <Card.Text>
                    <p>
                        That' s not an english article page!
                    </p>
                </Card.Text>

            }
            body = <Card.Body>
                {webSiteText}
                {resultText}
            </Card.Body>;
        }
        else {
            body = <Card.Body>
                <Card.Text>
                    <p>
                        Extension is disabled!
                    </p>
                </Card.Text>
            </Card.Body>
        }
        return (
            <div>
                <header>
                </header>
                <body>
                    <Card style={{ width: '20rem' }}>
                        <Card.Header>
                            <Row>
                                <Col xs={3}><Card.Img src={logo}  alt="logo"/></Col>
                                <Col><Card.Title className="text-secondary font-weight-bold">Fake News Detection</Card.Title></Col>
                            </Row>
                        </Card.Header>
                        {body}
                        <Card.Footer>
                            <Row>
                                <Col xs={8}><Card.Link className="text-secondary" href="mailto:name@email.com"><ExclamationTriangleFill /> Report an Issue</Card.Link></Col>
                                <Col><BootstrapSwitchButton checked={this.state.enabled} size='sm' onstyle="outline-info" offstyle="outline-danger" onChange={this.enabledChange}/></Col>
                            </Row>
                        </Card.Footer>
                    </Card>
                </body>
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
                this.setState({currentArticle: response.article});

                if(saveEnabled)         //Don' t get enabled from response when handle change on toggle button
                    this.setState({enabled: response.enabled});
                console.log("Enabled: "+this.state.enabled);
                this.setCurrentPageAndWebsite();

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
        chrome.runtime.sendMessage({type: "CREATE_REQUESTS", tab: tab}, (response) => {
            if (response) {
                const probabilityNumber = parseFloat(response.probability) * 100;
                const probabilityPercentage = probabilityNumber.toString() + " %";

                this.setState({currentArticle: response.article});
                this.setState({probabilityText: probabilityPercentage});
                this.setState({probability: probabilityNumber});

                this.sendUpdatePopUpMessage(tab, probabilityPercentage, probabilityNumber, this.state.currentArticle,  this.state.enabled);
            } else {
                console.error('There was an error on create requests!');
            }
        });
    }

    sendUpdatePopUpMessage(tab:any, probabilityPercentage:any, probabilityNumber:any, article:any, enabled:any){
        chrome.runtime.sendMessage(
            {
                type: "UPDATE_POPUP",
                tabId: tab.id,
                url: tab.url,
                probabilityText: probabilityPercentage,
                probability: probabilityNumber,
                article: article,
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
        this.setState({article: {title: "", text: ""}});
        this.sendUpdatePopUpMessage(tab, "",-1, {title: "", text: ""}, this.state.enabled);
    }

    setCurrentPageAndWebsite(){
        const pathArray = this.state.currentURL.split('/');
        let pageName = "";
        for (let i = 3; i < pathArray.length; i++) {
            pageName += "/";
            pageName += pathArray[i];
        }

        this.setState({currentWebsite: pathArray[2]});
        this.setState({currentPage: pageName});

    }


}

export default App;

