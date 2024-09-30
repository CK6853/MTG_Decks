import './App.css';
import React, { useState, useEffect } from "react";

// Colour icon locations
import U from "./data/img/U.png";
import W from "./data/img/W.png";
import R from "./data/img/R.png";
import G from "./data/img/G.png";
import B from "./data/img/B.png";

// White background (to be used as transparent or semi-transparent deck overlay)
import white from "./data/img/white.png";

// Import deck data
const decks = require("./data/decks.json")

// Main App
function App() {
  // Set up state for if a specific deck has been selected
  const [currentDeck, setCurrentDeck] = useState(null);
  return (
    <div className="App">
      {currentDeck // If a specific deck has been selected, display info for that deck
        ? <DeckInfo deck={currentDeck} return={() => setCurrentDeck(null)} />
        // Otherwise, display a list of all decks separated by category
        : getCats().map((category) => (
          // Each category contains a heading, and a series of decks
          <div>
            <div className="buffer"/>
            <h1>{category}</h1>
            <DeckSeries deck={decks.filter(deck => deck.category === category)} click={setCurrentDeck}/>
          </div>
        ))
      }
    </div>
  );
}

// Information about a specific deck, as specified by props.deck
// Also requires props.return, a function to return to the main list of decks
function DeckInfo(props) {
  let thisDeck = decks.filter((deck) => deck.title === props.deck)[0];
  return (
    <div>
      <div className="buffer" />
      <button onClick={() => props.return()}>Return to Decks</button>
      <div className="buffer" />
      <h1>{props.deck}</h1>
      <p>{thisDeck.desc}</p>
      <div className="DeckContainer">
        {thisDeck.displayCards.map((card) => (
          // If the Deck has "Display Cards" listed (e.g. Commanders), display them
          <DisplayCard card={card} />
        ))}
      </div>
      <div className="buffer" />
      <h2>Decklist</h2>
      <div className="DeckContainer">
        {/*Display a list of cards in each card category*/}
        <Decklist list={thisDeck.deck.play} title="Starts in Play" />
        <Decklist list={thisDeck.deck.deck} title="Starts in Deck" />
        <Decklist list={thisDeck.deck.sideboard} title="Sideboard" />
        <Decklist list={thisDeck.deck.tokens} title="Tokens" />
      </div>
    </div>
  )
}

// Displays a given list of cards as a read-only, copy-able text field
function Decklist(props) {
  if (!props.list || props.list.length === 0) return null;
  return (
    <div>
      <h3>{props.title}</h3>
      <textarea rows="20" cols="50" readonly value={props.list.join("\n")}></textarea>
    </div>
  )
}

// Show a Display Card by getting an image from the Scryfall API
function DisplayCard(props) {
  // Set a default image URL to a blank png while waiting for calls
  const [image, setImage] = useState(process.env.PUBLIC_URL + "/black.png")
  const url = `https://api.scryfall.com/cards/named?exact=${props.card}`

  // Fetch
  useEffect(() => {
    fetch(url)
    // On completion, set the image URL based on received data
    .then((res) => res.json())
    .then((res) => setImage(res.image_uris.png))
  }, [image, url])
  
  return (
    <img className="Display" src={image} alt="Card" />
  )
}

// Display a set of decks - usually based on Category
function DeckSeries(props) {
  return (
    <div className="DeckContainer">
      {props.deck.map((deck) => (
        // Display each Deck in this series as its own object
        <DeckBox deck={deck} click={props.click}/>
      ))}
    </div>
  )
}

// Display a single Deck
function DeckBox(props) {
  //console.log(process.env.PUBLIC_URL + `/deckImage/${props.deck.title}.jpg`)
  return (
    <div className="Box">
      <div className="BackImg">
        {/*A background image, from our local library*/}
        <img src={process.env.PUBLIC_URL + `/deckImage/${props.deck.title}.jpg`} alt="Background" />
      </div>
      <div className="Bounding">
        {/*Deck information from the saved data, including dynamically-selected colour icons*/}
        <h2>{props.deck.title}</h2>
        <Colours colours={props.deck.colours} />
        <p>{props.deck.desc}</p>
      </div>
      <div className="clickable" >
        {/*A transparent overlay, to take any click events and become slightly opaque on hover*/}
        <img src={white} alt="White" onClick={() => props.click(props.deck.title)}/>
      </div>
    </div>
  );
}

// Given a string of colour identifiers, return a series of 1-5 colour icons equivalent to the given string
function Colours(props) {
  let imgs = [];
  if (props.colours.includes("W")) {
    imgs.push(W);
  }
  if (props.colours.includes("U")) {
    imgs.push(U);
  }
  if (props.colours.includes("B")) {
    imgs.push(B);
  }
  if (props.colours.includes("R")) {
    imgs.push(R);
  }
  if (props.colours.includes("G")) {
    imgs.push(G);
  }
  return (
    <div className="Colours">
      {imgs.map((source) => (
        <img src={source} alt="Colour"/>
      ))}
    </div>
  )
}

// Get a list of deck categories for separated display
function getCats() {
  // Start with an empty array
  let cats = [];
  // Iterate through all decks
  for (let deck of decks) {
    // If we haven't seen this category before, record it
    if (!cats.includes(deck.category)) {
      cats.push(deck.category)
    }
  }
  // Return the completed list
  return cats;
}

export default App;