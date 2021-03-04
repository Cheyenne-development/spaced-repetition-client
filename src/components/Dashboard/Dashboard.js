import React, {Component} from 'react'
import LanguageService from '../../services/language-service'
import UserContext from '../../contexts/UserContext'
import { Link } from 'react-router-dom'
import Button from '../Button/Button'



import './Dashboard.css'

class Dashboard extends Component{
  state = {
    err: null,
    
  }

  static contextType = UserContext

  componentDidMount(){
    return LanguageService.getLangAndWords()
    .then(res => {
      this.context.setLang(res.language)
      this.context.setWords(res.words)
      
    })
    .catch(err => this.setState({err}));
    //In this case, force a logout and redirect the user to the login page in the frontend code.
    //history.push("/home")
  }
  
  render() {
    const listWords=(words)=>{
        const listItems = words.map((word, idx)=> {
            return (<li key={word+idx} className='word-item' style={idx%2 ? {"backgroundColor": "rgb(238, 222, 200)"}: null}>
                        <h4>{word.original}</h4>
                        <div>
                            <p className='correct-count'>correct answer count: {word.correct_count}</p>
                            <p>incorrect answer count: {word.incorrect_count}</p>
                        </div>
                    </li>)
        })
        return (<ul className="all-words">{listItems}</ul>)
    }

    return (
            <section className='Dashboard'>                
                <div className='dashboard-top'>
                    <h2>You're learning:  {this.context.language ? this.context.language.name : null}
                    <p className='correct-answers'>{this.context.language ? `Total correct answers: ${this.context.language.total_score}` : null}</p>
                    </h2>
                    <Link to='/learn' >
                        <Button>
                        Start practicing
                        </Button>
                    </Link>
                </div>
                
                <div>
                    <h3>Words to practice</h3>
                    {this.context.words ? listWords(this.context.words) : null}
                </div>
            </section>
            
    )
  }
}

export default Dashboard