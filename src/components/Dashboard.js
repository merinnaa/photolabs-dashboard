import React, { Component } from "react";
import Loading from "./Loading";
import classnames from "classnames";
import Panel from "./Panel";
//import { response } from "express";
import { getTotalPhotos,
getTotalTopics,
getUserWithMostUploads,
getUserWithLeastUploads} from "helpers/selectors";

const data = [
  {
    id: 1,
    label: "Total Photos",
    getValue: getTotalPhotos
  },
  {
    id: 2,
    label: "Total Topics",
    getValue: getTotalTopics
  },
  {
    id: 3,
    label: "User with the most uploads",
    getValue: getUserWithMostUploads
  },
  {
    id: 4,
    label: "User with the least uploads",
    getValue: getUserWithLeastUploads
  }
];

class Dashboard extends Component {
   state = {
loading: true,
focused: null,
photos:[],
topics:[]
  }
 
  componentDidMount(){
    console.log("componentdidmount")
    fetch("/api/photos").then(response =>response.json()).then(data => console.log(data));
    const urlsPromise = [
      "/api/photos",
      "/api/topics",
    ].map(url => fetch(url).then(response => response.json()));


console.log()

    Promise.all(urlsPromise)
    .then(([photos, topics]) => {
      console.log(photos)
      this.setState({
        loading: false,
        photos: photos,
        topics: topics
      });
    });

    const focused = JSON.parse(localStorage.getItem("focused"));
    if(focused){
      this.setState({ focused });
    }
  }

  componentDidUpdate(previousProps, previousState){
    if(previousProps.focused !== this.state.focused){
      localStorage.setItem("focused", JSON.stringify(this.state.focused));
    }
  }

  selectPanel(id) {
    this.setState(previousState => ({
      focused: previousState.focused !== null ? null : id
    }));
  }
  

  render() {
    console.log(this.state)
    const dashboardClasses = classnames("dashboard", {"dashboard--focused":this.state.focused});
if (this.state.loading){
  return <Loading />;
}

const panels = (this.state.focused?data.filter(panel => this.state.focused === panel.id):data)
.map(panel => (
  <Panel 
  key= {panel.id}
  
  label={panel.label}
  value={panel.getValue(this.state)}
  onSelect={() => this.selectPanel(panel.id)}
  />
)
)


    return <main className={dashboardClasses}>{panels}</main> ;
  }
}

export default Dashboard;
