import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Input, Required, Label } from '../Form/Form'
import AuthApiService from '../../services/auth-api-service'
import UserContext from "../../contexts/UserContext"
import Button from '../Button/Button'
import './RegistrationForm.css'

class RegistrationForm extends Component {
  static defaultProps = {
    onRegistrationSuccess: () => { }
  }
  static contextType = UserContext;
  state = { error: null }

  firstInput = React.createRef()

  handleSubmit = ev => {
    ev.preventDefault()
    const { name, username, password } = ev.target
    AuthApiService.postUser({
      name: name.value,
      username: username.value,
      password: password.value,
    })
    .then((res) => {
      AuthApiService.postLogin({ 
        username: username.value, 
        password: password.value})
        .then(res => {
        name.value = ''
        username.value = ''
        password.value = ''
        this.context.processLogin(res.authToken)
        })
    })
    
      .catch(res => {
        this.setState({ error: res.error })
      })
  }

  componentDidMount() {
    this.firstInput.current.focus()
  }

  render() {
    const { error } = this.state
    return (
      <form className='registration-form'
        onSubmit={this.handleSubmit}
      >
        <div role='alert'>
          {error && <p>{error}</p>}
        </div>
        <div className='registration-input'>
          <Label className='registration-label' htmlFor='registration-name-input'>
            Enter your name<Required />
          </Label>
          <Input
            ref={this.firstInput}
            id='registration-name-input'
            aria-label='Enter your name'
            aria-required='true'
            name='name'
            required
          />
        </div>
        <div className='registration-input'>
          <Label className='registration-label' htmlFor='registration-username-input'>
            Choose a username<Required />
          </Label>
          <Input
            id='registration-username-input'
            aria-required='true'
            aria-label='Please choose a Username'
            name='username'
            required
          />
        </div>
        <div className='registration-input'>
          <Label className='registration-label' htmlFor='registration-password-input'>
            Choose a password<Required />
          </Label>
          <Input
            id='registration-password-input'
            aria-required='true'
            aria-label='Please choose a password'
            name='password'
            type='password'
            required
          />
        </div>
        <footer>
          <div className='foot'>
          <Button type='submit'>
            Sign up
          </Button>
          {' '}
          <Link to={'/login'} className="login"><span>Already have an account?</span></Link>
          </div>
        </footer>
      </form>
    )
  }
}

export default RegistrationForm