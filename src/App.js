import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

class App extends React.Component {
    constructor(){
      super();
      this.state = {items: []}
    }

    componentWillMount(){
      

      this.setState({items: fetchAllItems()});
      /*axios.get("https://swapi.co/api/people/")
      .then(response =>
        this.setState({items: response.data.results})
      )*/
    }

    handleChange(e){
      //sets the items array to the current search results
      this.setState({items: fetchAllItems(e.target.value)});
    }


    render(){
      let items = this.state.items

      console.log(items);

      return(
        <div>
          <input type="text"
           onChange={this.handleChange.bind(this)}/>
          {items.map(item => 
            <Person person={item} />)}
        </div>
      )
    }
}

const Person = (props) => <h4>{props.person}</h4>

//compare each of the names
function compareNames(a, b) {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
}

//prep
function prepareItems(array) {
  let combined = [];
  array.forEach((item) => {
    combined = combined.concat(item);
  });

  return combined.map((item) => {
    if (Object.hasOwnProperty.call(item, 'episode_id')) {
      return {
        type: 'film',
        name: item.title,
        episode_id: item.episode_id,
        director: item.director,
        producer: item.producer,
        release_date: item.release_date,
      };
    } else if (Object.hasOwnProperty.call(item, 'model')) {
      return {
        type: 'starship',
        name: item.name,
        model: item.model,
        hyperdrive_rating: item.hyperdrive_rating,
        manufacturer: item.manufacturer,
      };
    } else if (Object.hasOwnProperty.call(item, 'classification')) {
      return {
        type: 'species',
        name: item.name,
        classification: item.classification,
        designation: item.designation,
        language: item.language,
      };
    } else if (Object.hasOwnProperty.call(item, 'orbital_period')) {
      return {
        type: 'planet',
        name: item.name,
        gravity: item.gravity,
        terrain: item.terrain,
        population: item.population,
      };
    }
    return {
      type: 'person',
      name: item.name,
      gender: item.gender,
      height: item.height,
      mass: item.mass,
    };
  }).sort(compareNames);
}

//deal with fetching results from all endpoints. 
function fetchAllItems(searchStr) {
  
  let results =[];

  const endpoints = [
    `https://swapi.co/api/people/?search=${searchStr}`,
    `https://swapi.co/api/films/?search=${searchStr}`,
    `https://swapi.co/api/starships/?search=${searchStr}`,
    `https://swapi.co/api/species/?search=${searchStr}`,
    `https://swapi.co/api/planets/?search=${searchStr}`,
  ];

  //get requests for each of the endpoints listed above
  Promise.all(endpoints.map(url =>
      axios.get(url) 
      .then(res => prepareItems(res.data.results))
      .then(json => results.push(json) ) ));

  return results;
}

export default App;
