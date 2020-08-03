import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import {getCurrentTab} from "./utils";

class App extends Component {

    private static apiURL = "http://localhost:5000/";
    private static scraperSuffix = "scraper";
    private static predictSuffix = "predict";
    private static article = {
        "title": "Specter of Trump Loosens Tongues, if Not Purse Strings, in Silicon Valley - The New York Times",
        "text": "Silicon Valley has leapt into the fray. The prospect of a President Donald J. Trump is pushing the tech community to move beyond its traditional role as donors and to embrace a new existence as agitators and activists. A distinguished venture capital firm emblazoned on its corporate home page an earthy   epithet. One prominent tech chieftain says the consequences of Mr. Trump’s election would “range between disastrous and terrible. ” Another compares him to a dictator. And nearly 150 tech leaders signed an open letter decrying Mr. Trump and his campaign of “anger” and “bigotry. ” Not quite all the action is  . Peter Thiel, a founder of PayPal and Palantir who was the first outside investor in Facebook, spoke at the Republican convention in July. The New York Times reported on Saturday that Mr. Thiel is giving $1. 25 million to support Mr. Trump’s candidacy even as other supporters flee. (He also recently gave $1 million to a “super PAC” that supports Senator Rob Portman, the Republican freshman running for   in Ohio.) Getting involved in politics used to be seen as clashing with Silicon Valley’s value system: You transform the world by making problems obsolete, not solving them through Washington. Nor did entrepreneurs want to alienate whatever segment of customers did not agree with them politically. Such reticence is no longer in style here. “We’re a bunch of nerds not used to having a lot of limelight,” said Dave McClure, an investor who runs a tech incubator called 500 Startups. “But to quote   ‘With great power comes great responsibility. ’” Mr. McClure grew worried after the Republican and Democratic conventions as Mr. Trump began to catch up to Hillary Clinton in the polls. He wanted Silicon Valley to do more, and so late last month he announced Nerdz4Hillary, an informal   effort. An initial group of donors pledged $50, 000 the goal was to ask the “nerdz” for small donations to match that sum. They have not come through yet. “We’re kind of optimistic we’ll get the other $50, 000 in a few weeks,” Mr. McClure said. That relatively slow pace reflects Silicon Valley’s shifting position: Even as it becomes increasingly free with its opinions, it has been less free with its checkbook. The most recent data, from late August, shows Mrs. Clinton taking in $7. 7 million from the tech community, according to Crowdpac, a   that tracks donations. By that point in 2012, Crowdpac says, President Obama had raised $21 million from entrepreneurs and venture capitalists. Reid Hoffman, the billionaire   of the business networking site LinkedIn, offers a snapshot of Silicon Valley’s evolving approach to politics. Mr. Hoffman was a top Obama donor, giving $1 million to the Priorities USA political action committee, something several of his peers did as well. Last month, Mr. Hoffman garnered worldwide publicity for saying he would donate up to $5 million to veterans’ groups if Mr. Trump released his taxes, a remote possibility that never came to pass. He has castigated Mr. Trump in interviews, saying he was speaking for those who were afraid. Mr. Hoffman’s outright donations, however, have been smaller this election cycle. In May, he gave $400, 000 to the Hillary Victory Fund. Asked if there was more recent giving that had not shown up in federal election records, Mr. Hoffman cryptically responded in an email, “Looking at some PACs, etc. ” He declined several opportunities to elaborate. Even as Priorities USA has raised $133 million this election cycle, far exceeding its total in 2012, its tech contributions have dwindled. The only familiar tech name this time around is John Doerr of the venture capital firm Kleiner Perkins Caufield  Byers, who gave $500, 000. The AOL   Steve Case said his September endorsement of Mrs. Clinton, via an   in The Washington Post, was the first time he ever publicly declared for a candidate. “I always focused on policy and avoided politics,” he said. “But if Trump were elected president, I would be disappointed in myself for not acting. ” When he wrote the   he was uncertain about donating money to Mrs. Clinton, saying only that it was “probable. ” A spokeswoman said Sunday that Mr. Case gave $25, 000 to the Hillary Victory Fund. Mason Harrison, Crowdpac’s head of communications, offered a possible reason for Mrs. Clinton’s    support. “Donors give to support candidates they love, not to defeat candidates they fear,” he said. A few billionaires are acting instead of talking. Dustin Moskovitz, a founder of Facebook, said he was giving $20 million to various Democratic election efforts  —   the first time he and his wife, Cari Tuna, have endorsed a candidate. He declined to be interviewed. Part of the problem for Mrs. Clinton is that, however preferable she may be to Mr. Trump in the tech community, she pales in comparison to President Obama. After some initial misgivings, Silicon Valley found its champion in him. There has been a revolving door between tech and the Obama administration, just as previous Democratic administrations had a revolving door with Wall Street. In June, President Obama seemed to suggest that he might become a venture capitalist after his term ends. Mrs. Clinton is not as enthusiastic toward Silicon Valley and its disruptive ways. In a speech in the summer of 2015, she noted that   in the “  or   gig economy”  —   Uber, Airbnb and their ilk  —   were “unleashing innovation” but also “raising hard questions about workplace protection and what a good job will look like in the future. ” The Clinton campaign declined to comment. The Trump campaign did not respond to a query. Even as Silicon Valley works against Mr. Trump, there is quiet acknowledgment that his campaign has bared some important issues. In an endorsement this month of Mrs. Clinton, the venture capital firm Union Square Ventures pointed out that “the benefits of technology and globalization have not been evenly distributed,” and that this needed to change. If Silicon Valley’s political involvement outlasts this unusual election, the tech community may start contributing more to the process than commentary and cash. “Not only are tech people going to be wielding influence, but they’re going to be the candidate,” Mr. McClure said. “Reid Hoffman, Sheryl Sandberg”  —   the chief operating officer of Facebook  —   “and a bunch of other folks here have political aspirations. ” Others may be inspired to enter politics through other doors. Palmer Luckey is the    founder of the Oculus virtual reality company, which he sold to Facebook for $2 billion. Mr. Luckey donated $10, 000 to a group dedicated to spreading    messages about Mrs. Clinton both online and off. The group’s first billboard, said to be outside Pittsburgh, labeled her “Too Big to Jail. ” Mr. Luckey told The Daily Beast that his thinking “went along the lines of, ‘Hey, I have a bunch of money. I would love to see more of this stuff. ’” He added, “I thought it sounded like a real jolly good time. ” Many virtual reality developers were less happy, and Mr. Luckey quickly posted his regrets on Facebook. He declined to comment further. “If we’re going to be more vocal, we’ll have to live more transparently,” said Hunter Walk, a venture capitalist whose campaign to persuade tech companies to give workers Election Day off signed up nearly 300 firms, including Spotify, SurveyMonkey and TaskRabbit. “There will be a period of adjustment. ” But perhaps being vocal is a temporary condition after all. The venture firm CRV was in the spotlight at the end of August with its blunt   message, which included the earthy epithet. A few weeks later, it cleaned up its website. The partners went from employing a publicist to seek out attention to declining interviews. “We reached everyone we wanted to reach, and hopefully influenced opinions,” said Saar Gur, a CRV venture capitalist. “Then the buzz died down and we went back to our day jobs, which are super busy. "
    };
    private static testURL =  { "url": "http://www.tokoulouri.com/economy/avra/" };


    state = {
        probabilityText: "",
        probability: 0,
        currentArticle: "",
        currentURL: ""
    };


    constructor(props: any) {
        super(props);

        //chrome.browserAction.setBadgeText({text: ""})
        //chrome.browserAction.setBadgeBackgroundColor({color: ""})

        this.createScraperRequest = this.createScraperRequest.bind(this);
        this.createPredictRequest = this.createPredictRequest.bind(this);
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
        getCurrentTab((tab:any) => {

            // Get previous tab state if exists
            chrome.runtime.sendMessage({type: "INIT_POPUP", tabId: tab.id}, (response) => {
                console.log(response)
                if(response){
                    console.log("Set the state");
                    this.setState({probabilityText: response.probabilityText});
                    this.setState({probability: response.probability});
                }
            });

            // Create post request to backend API
            const currentURL = tab.url
            if(this.state.probabilityText == "" || this.state.currentURL != currentURL) {
                console.log("Time to predict for: "+currentURL);
                this.setState({currentURL: currentURL});
                this.createScraperRequest();
            }
        });
    }

    createRequestOptions(httpMethod: string, body: {}){
        return {
            method: httpMethod,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        };
    }

    createApiURL(suffix: string){
        return App.apiURL + suffix;
    }

    createScraperRequest() {
        // POST request using fetch with error handling
        const currentURL = {"url": this.state.currentURL};
        const requestOptions = this.createRequestOptions('POST', currentURL);
        const apiURL = this.createApiURL(App.scraperSuffix);
        fetch(apiURL, requestOptions)
            .then(async response => {
                const data = await response.json();

                // check for error response
                if (!response.ok) {
                    // get error message from body or default to response status
                    const error = (data && data.message) || response.status;
                    return Promise.reject(error);
                }
                const article = {"title": data.title, "text": data.text};
                this.setState({currentArticle: article});

                this.createPredictRequest();

            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    createPredictRequest() {
        // POST request using fetch with error handling
        const requestOptions = this.createRequestOptions('POST', this.state.currentArticle);
        const apiURL = this.createApiURL(App.predictSuffix);
        console.log(this.state.currentURL);
        console.log(this.state.currentArticle);
        fetch(apiURL, requestOptions)
            .then(async response => {
                const data = await response.json();

                // check for error response
                if (!response.ok) {
                    // get error message from body or default to response status
                    const error = (data && data.message) || response.status;
                    return Promise.reject(error);
                }

                // Format notification badge
                const probabilityNumber = parseFloat(data.probability) * 100;
                const probabilityPercentage = probabilityNumber.toString() + " %";


                this.setState({probabilityText: probabilityPercentage});
                this.setState({probability: probabilityNumber});

                getCurrentTab((tab:any) => {
                    chrome.runtime.sendMessage({type: "UPDATE_POPUP", tabId: tab.id, probabilityText: probabilityPercentage, probability: probabilityNumber}, (response) => {
                        console.log(response)
                        if(!response || response != "OK"){
                            console.error('There was an error on state update!');
                        }
                    });
                });

            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }


}

export default App;

