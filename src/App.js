import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import {Grid, Jumbotron} from 'react-bootstrap';

import './App.css';

class App extends React.Component {
    constructor(){
      super();
      this.state = {items: []};
    }

    componentWillMount(){
      //
    }

    handleChange(e){
      //sets the items array to the current search results
      //deal with fetching results from all endpoints. 

      let searchStr = e.target.value;
      let self = this;

      const endpoints = [
        `https://swapi.co/api/people/?search=${searchStr}`,
        `https://swapi.co/api/films/?search=${searchStr}`,
        `https://swapi.co/api/starships/?search=${searchStr}`,
        `https://swapi.co/api/vehicles/?search=${searchStr}`,
        `https://swapi.co/api/species/?search=${searchStr}`,
        `https://swapi.co/api/planets/?search=${searchStr}`,
      ];

      //get requests for each of the endpoints listed above
      axios.all(endpoints.map(url =>
          axios.get(url) 
      ))
      .then(axios.spread(function (people, films, starships, vehicles, species, planets){
        let peopleData = people.data.results || [];
        let filmData = films.data.results || [];
        let ssData = starships.data.results || [];
        let speciesData = species.data.results || [];
        let planetData = planets.data.results || [];
        let vehicleData = vehicles.data.results || [];

        let allData = peopleData.concat(filmData, ssData, speciesData, planetData, vehicleData);
        self.setState({items: allData})
      }))
      .catch(error => console.log(error));
    }

    render(){
      let items = this.state.items

      //items.forEach(i => console.log(i));
      return(
        <div className='container'>
          <div className='search'>
            <Header />
            <input type="text" className="input-box"
             onChange={this.handleChange.bind(this)}/>
          </div>
          <div className='results'>

             {items.length === 0 && <h2> No results</h2>}
             {items.length > 0 && <Results items={items} />}

          </div> 
      </div>
      )
    }
}

const Header = props => (
  <Jumbotron>
    <grid>
      <h1 className='search-title'>SWAPI Search</h1>
      <p className="search-subtitle">Search the SWAPI</p>
   </grid>

  </Jumbotron>
);


const Results = props => (
  <ul className="results">
    {props.items.map((item, i) => {
      let type = ""; //store the type based on attributes
      
      if (Object.hasOwnProperty.call(item, 'episode_id')){
        type='film';
      }else if(Object.hasOwnProperty.call(item, 'model')){
        type='starship';
      }else if(Object.hasOwnProperty.call(item, 'classification')){
        type='species';
      }else if(Object.hasOwnProperty.call(item, 'orbital_period')){
        type='planet';
      }else if(Object.hasOwnProperty.call(item, '"vehicle_class"')){
        type='vehicle';
      }
      switch (type) {
        case 'film':
          return <Film key={i} item={item} />;
        case 'planet':
          return <Planet key={i} item={item} />;
        case 'species':
          return <Species key={i} item={item} />;
        case 'starship':
          return <Starship key={i} item={item} />;
        case 'vehicle':
          return <Vehicle key={i} item={item} />;;
        default:

          return <Person key={i} item={item}/>;
      }
    })}
  </ul>
);

//display peoples information

class Person extends React.Component{

  constructor(props){
    
    super(props);
    this.state = {
      planet: "",
      species: [],
      films: [],
      starships: [],
      vehicles: [],
    }
    }

  componentDidMount(){

    let self = this;
    
    //set the hometown
    axios.get(this.props.item.homeworld)
    .then(res => res.data)
    .then(res => self.setState({planet: res.name}));

    // axios.get(this.props.item.species)
    // .then(res => res.data)
    // .then(res => self.setState({species: }))

    //this.setState({list: this.state.list.concat([newObject])});

    this.props.item.species.forEach(i => {
      axios.get(i)
      .then(res => res.data)
      .then(res => res.name)
      .then(res => self.setState({species: self.state.species.concat(res)}));
    });

    this.props.item.films.forEach(i => {
      axios.get(i)
      .then(res => res.data)
      .then(res => res.title)
      .then(res => self.setState({films: self.state.films.concat(res)}));
    });

    this.props.item.starships.forEach(i => {
      axios.get(i)
      .then(res => res.data)
      .then(res => res.name)
      .then(res => self.setState({starships: self.state.starships.concat(res)}));
    });

    this.props.item.vehicles.forEach(i => {
      axios.get(i)
      .then(res => res.data)
      .then(res => res.name)
      .then(res => self.setState({vehicles: self.state.vehicles.concat(res)}));
    });
  }


  render() {
        return (
          <div className="result-item">
              <h2>{this.props.item.name}</h2>
              <hr />
              <ul>
                <li> homeworld: {this.state.planet} </li>
                <li> gender: {this.props.item.gender} </li>
              </ul>
              <h2> Movies </h2>
              <ul> 
                {this.state.films.map(i =>
                <li>{i}</li>)}
              </ul>
              <h2> Starships </h2>
              <ul> 
                {this.state.starships.map(i =>
                <li>{i}</li>)}
              </ul>
          </div>
        )
    }
}

class Planet extends React.Component{

  constructor(props){
    
    super(props);
    this.state = {
      films: [],
      residents: [],
    }
    }

  componentDidMount(){

    let self = this;

    this.props.item.films.forEach(i => {
      axios.get(i)
      .then(res => res.data)
      .then(res => res.title)
      .then(res => self.setState({films: self.state.films.concat(res)}));
    });

    this.props.item.residents.forEach(i => {
      axios.get(i)
      .then(res => res.data)
      .then(res => res.name)
      .then(res => self.setState({residents: self.state.residents.concat(res)}));
    });
  }


  render() {
        return (
          <div className="result-item">
              <h2>{this.props.item.name}</h2>
              <hr />
              <ul>
                <li> climate: {this.props.item.climate} </li>
                <li> diameter: {this.props.item.diameter} </li>
              </ul>
              <h2> Residents </h2>
              <ul> 
                {this.state.residents.map(i =>
                <li>{i}</li>)}
              </ul>
              <h2> Films </h2>
              <ul> 
                {this.state.films.map(i =>
                <li>{i}</li>)}
              </ul>
          </div>
        )
    }
}

class Starship extends React.Component{

  constructor(props){
    
    super(props);
    this.state = {
      pilots: [],
      films: [],
    }
    }

  componentDidMount(){

    let self = this;

    this.props.item.films.forEach(i => {
      axios.get(i)
      .then(res => res.data)
      .then(res => res.title)
      .then(res => self.setState({films: self.state.films.concat(res)}));
    });

    this.props.item.pilots.forEach(i => {
      axios.get(i)
      .then(res => res.data)
      .then(res => res.name)
      .then(res => self.setState({pilots: self.state.pilots.concat(res)}));
    });
  }


  render() {
        return (
          <div className="result-item">
              <h2>{this.props.item.name}</h2>
              <hr />
              <ul>
                <li> model: {this.props.item.model} </li>
                <li> crew: {this.props.item.crew} </li>
              </ul>
              <h2> Pilots </h2>
              <ul> 
                {this.state.pilots.map(i =>
                <li>{i}</li>)}
              </ul>
              <h2> Films </h2>
              <ul> 
                {this.state.films.map(i =>
                <li>{i}</li>)}
              </ul>
          </div>
        )
    }
}

class Vehicle extends React.Component{

  constructor(props){
    
    super(props);
    this.state = {
      films: [],
    }
    }

  componentDidMount(){

    let self = this;

    this.props.item.films.forEach(i => {
      axios.get(i)
      .then(res => res.data)
      .then(res => res.title)
      .then(res => self.setState({films: self.state.films.concat(res)}));
    });
  }

  render() {
        return (
          <div className="result-item">
              <h2>{this.props.item.name}</h2>
              <hr />
              <ul>
                <li> model: {this.props.item.model} </li>
                <li> crew: {this.props.item.crew} </li>
                <li> passengers: {this.props.item.passengers} </li>
              </ul>
              <h2> Films </h2>
              <ul> 
                {this.state.films.map(i =>
                <li>{i}</li>)}
              </ul>
          </div>
        )
    }
}

class Species extends React.Component{

  constructor(props){
    
    super(props);
    this.state = {
      films: [],
      people: [],
    }
    }

  componentDidMount(){

    let self = this;

    this.props.item.films.forEach(i => {
      axios.get(i)
      .then(res => res.data)
      .then(res => res.title)
      .then(res => self.setState({films: self.state.films.concat(res)}));
    });

    this.props.item.people.forEach(i => {
      axios.get(i)
      .then(res => res.data)
      .then(res => res.name)
      .then(res => self.setState({people: self.state.people.concat(res)}));
    });
  }


  render() {
        return (
          <div className="result-item">
              <h2>{this.props.item.name}</h2>
              <hr />
              <ul>
                <li> language: {this.props.item.language} </li>
                <li> classification: {this.props.item.classification} </li>
              </ul>
              <h2> People </h2>
              <ul> 
                {this.state.people.map(i =>
                <li>{i}</li>)}
              </ul>
              <h2> Films </h2>
              <ul> 
                {this.state.films.map(i =>
                <li>{i}</li>)}
              </ul>
          </div>
        )
    }
}

class Film extends React.Component{

  constructor(props){
    
    super(props);
    this.state = {
      characters: [],
      species: [],
      starships: [],
    }
    }

  componentDidMount(){

    let self = this;

    this.props.item.species.forEach(i => {
      axios.get(i)
      .then(res => res.data)
      .then(res => res.name)
      .then(res => self.setState({species: self.state.species.concat(res)}));
    });

    this.props.item.characters.forEach(i => {
      axios.get(i)
      .then(res => res.data)
      .then(res => res.name)
      .then(res => self.setState({characters: self.state.characters.concat(res)}));
    });

    this.props.item.starships.forEach(i => {
      axios.get(i)
      .then(res => res.data)
      .then(res => res.name)
      .then(res => self.setState({starships: self.state.starships.concat(res)}));
    });
  }


  render() {
        return (
          <div className="result-item">
              <h2>{this.props.item.title}</h2>
              <hr />
              <ul>
                <li> director: {this.props.item.director} </li>
                <li> release_date: {this.props.item.release_date} </li>
              </ul>
              <h2> Characters </h2>
              <ul> 
                {this.state.characters.map(i =>
                <li>{i}</li>)}
              </ul>
              <h2> Starships </h2>
              <ul> 
                {this.state.starships.map(i =>
                <li>{i}</li>)}
              </ul>
          </div>
        )
    }
}

export default App;
