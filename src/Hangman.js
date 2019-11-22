import React, { Component } from "react";
import "./Hangman.css";

// IMAGES IMPORTS
import img0 from "./imgs/0-Errors.jpg";
import img1 from "./imgs/1-Error.jpg";
import img2 from"./imgs/2-Errors.jpg";
import img3 from "./imgs/3-Errors.jpg";
import img4 from "./imgs/4-Errors.jpg";
import img5 from "./imgs/5-Errors.jpg";
import img6 from "./imgs/6-Errors.jpg";   
 
// API IMPORT
import { getRandomWord } from "./api";  

class Hangman extends Component {
    static defaultProps = {
        maxWrong: 6, 
        images: [img0, img1, img2, img3, img4, img5, img6],
        points: [6, 5, 4, 3, 2, 1, 0]    
    } 

    constructor(props) {
        super(props);
        this.state = {  
            wrongAnswers: 0, 
            guessedLetters: new Set(), 
            answer: undefined,     
            highscore: 0}; 
        this.handleClick = this.handleClick.bind(this);
        this.resetGame = this.resetGame.bind(this);  
    }

    async componentDidMount() { 
        let randomWord = await getRandomWord();
        this.setState({ answer: randomWord }); 
    } 

    createButtons() {
        const qwerty = "qwertyuiopasdfghjklzxcvbnm123456789";
        return qwerty.split("").map((letter, i) => (
            <button  
                key={i}  
                value={letter} 
                onClick={this.handleClick} 
                disabled={this.state.guessedLetters.has(letter)}  
            > 
                {letter}   
            </button> 
        ));
    } 

    evaluateHighscore() {
        const previousHighscore = this.state.highscore;
        const score = this.props.points[this.state.wrongAnswers]; 
        const newHighscore = score >= previousHighscore ? score : previousHighscore;
        return newHighscore;
    }

    guessWord(answer) {
        if (!answer) {
            return [];
        }
         
        return answer
            .split("")  
            .map(letter => this.state.guessedLetters.has(letter) ? letter : "_");   
    }

    handleClick(event) {
        let letter = event.target.value;
        this.setState(st => ({
            wrongAnswers: st.wrongAnswers + (st.answer.includes(letter) ? 0 : 1),
            guessedLetters: st.guessedLetters.add(letter)  
        }));
    }

    resetGame() { 
        const newHighscore = this.evaluateHighscore(); 

        getRandomWord().then((randomWord) => { 
            this.setState({  
                wrongAnswers: 0,
                guessedLetters: new Set(),
                answer: randomWord, 
                highscore: newHighscore 
            }); 
        })
    } 

    isWinner() {
        if(!this.state.answer) {
            return false;
        }
        return this.guessWord(this.state.answer).join("") === this.state.answer;
    }

    render() {
        const imgAlt = `${this.state.wrongAnswers} of ${this.props.maxWrong} guesses remaining`;
        const isLoser = this.state.wrongAnswers >= this.props.maxWrong; 
        const isWinner = this.guessWord(this.state.answer).join("") === this.state.answer; 
        const points = this.props.points[this.state.wrongAnswers] === 1 ? "point" : "points"; 
        
        let highscore = this.state.highscore;
        let gameState = this.createButtons();
        if (isWinner) {
            gameState = "You Won!"; 
        }
   
        if (isLoser) {
            gameState = "You Lost!"  
        } 

        return ( 
            <div className="Hangman">
                <h1>Hangman</h1> 
                <div className="Hangman-bar"></div>
                <p>Highscore: {highscore} {points}</p>    
                <div className="Hangman-container">
                    <div className="Hangman-interface">
                        <p className="Hangman-word">
                            {!isLoser ? this.guessWord(this.state.answer) : this.state.answer}  
                        </p>    
                        <p className="Hangman-letters">
                            {gameState}
                        </p>    
                        <p>
                            Guesses left: {6 - this.state.wrongAnswers}   
                        </p>  
                        {(isWinner || isLoser) && <button className="Hangman-reset" onClick={this.resetGame}>Try Again</button>}    
                    </div>  
                        
                    <div className="Hangman-image">
                        <img src={this.props.images[this.state.wrongAnswers]} alt={imgAlt}></img>
                    </div>      
                </div>          
            </div>    
        ) 
    }
}

export default Hangman;