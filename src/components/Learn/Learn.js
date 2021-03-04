import React, { Component } from "react";

import LanguageService from "../../services/language-service";
import UserContext from "../../contexts/UserContext";

import { Label, Input } from "../Form/Form";

import "./Learn.css";

class Learn extends Component {
  state = {
    err: null,
    currDisplay: "question",
  };

  static contextType = UserContext;

  componentDidMount() {
    LanguageService.getNextWord()
      .then((res) => {
        this.context.setNext(res);
        this.context.setScore(res.totalScore);
      })
      .catch((err) => this.setState({ err }));
  }

  displayH2Txt = () => {
    if (this.state.currDisplay === "question") return "Translate the word:";
    if (this.state.currDisplay === "wrong")
      return "Not quite right, keep going and you'll get it.";
    if (this.state.currDisplay === "right") return "You were correct!";
  };
  displayWord = () => {
    if (this.state.currDisplay === "question")
      return this.context.nextWord ? this.context.nextWord.nextWord : null;
  };
  displayFeedback = () => {
    if (this.state.currDisplay === "question") {
      return (
        <Label htmlFor="learn-guess-input">
          What's the translation for this word?
        </Label>
      );
    }
    return (
      <div className="DisplayFeedback">
        <p>
          The correct translation for {this.context.currWord.nextWord} was {this.context.nextWord.answer} and you chose {this.context.guess}!
        </p>
      </div>
    );
  };
  createCSSclassName = () => {
    return this.state.currDisplay === "question" 
    ? <button className="submitButton" type="submit">
        {this.displayBtnTxt()}
      </button>
     
     : <button className="submitBtn" type="submit">
        {this.displayBtnTxt()}
      </button>
    
  };

  displayBtnTxt = () => {
    return this.state.currDisplay === "question"
      ? "Submit your answer"
      : "Try another word!";
  };
  displayCounts = () => {
    if (this.state.currDisplay === 'question') {
        return (
        <>
                <p className="correct-count">You have answered this word correctly {this.context.nextWord ? this.context.nextWord.wordCorrectCount : '?'} times.</p>
                <p>You have answered this word incorrectly {this.context.nextWord ? this.context.nextWord.wordIncorrectCount : '?'} times.</p>
        </>)
    } else if (this.state.currDisplay === "right") {
      return (
      <>
             <p className="correct-count">You have answered this word correctly {this.context.currWord ? this.context.currWord.wordCorrectCount + 1 : "?"} times.</p>
             <p>You have answered this word incorrectly {this.context.currWord ? this.context.currWord.wordIncorrectCount : "?"} times.</p>
        </>
      );
    } else {
      return (
        <>
        <p className="correct-count">You have answered this word correctly  {this.context.currWord ? this.context.currWord.wordCorrectCount : "?"} times.</p>
        <p>You have answered this word incorrectly {this.context.currWord ? this.context.currWord.wordIncorrectCount + 1 : "?"} times.</p>
        </>
      )
    }
  }
  handleClickSubmit = (e) => {
    e.preventDefault();
    if (this.state.currDisplay === "question") {
      const guess = e.target.guess.value.trim();
      if (!guess) {
        alert("Please enter your guess");
      } else {
        this.context.setCurr(this.context.nextWord);
        this.context.setGuess(guess);

        LanguageService.setGuess(guess)
          .then((res) => {
            this.context.setNext(res);
            this.context.setScore(res.totalScore);
            res.isCorrect
              ? this.setState({
                  currDisplay: "right",
                })
              : this.setState({
                  currDisplay: "wrong",
                });
          })
          .catch((err) => console.log(err));
      }
    } else {
      LanguageService.getNextWord()
        .then((res) => {
          this.setState({
            currDisplay: "question",
          });
        })
        .catch((err) => this.setState({ err }));
    }
  };

  render() {
    return (
      <section className="Learn">
        <h2>{this.displayH2Txt()}</h2>
        <span className="CurrWord">{this.displayWord()}</span>
        <div className="DisplayScore">
          <p className="total-score">
            Your total score is: {this.context.nextWord ? this.context.score : null}
          </p>
        </div>
        <form className="MakeGuess" onSubmit={this.handleClickSubmit}>
          {this.displayFeedback()}
          {this.state.currDisplay === "question" && (
          <Input 
              id="learn-guess-input"
              name="guess"
              placeholder="your answer"
              required
            />
          )}
          {this.createCSSclassName()}
          {this.displayCounts()}
        </form>
      </section>
    );
  }
}
export default Learn;
