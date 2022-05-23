import React, { useState, useContext } from 'react'
import useStyles from './styles'
import { TextField, Grid, Button, FormControl, Card, CardContent, Switch, FormLabel } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { ExpenseTrackerContext, saveUser } from '../../context/context'
import axios from "axios";
import { useNavigate } from "react-router";
import Cookies from "js-cookie"

const LoginPopup = (props) => {
  const navigate = useNavigate();
  const { addUser, setUser, url } = useContext(ExpenseTrackerContext)
  const [formData, setFormData] = useState({email: "", password: "", name:"", surname:""});
  const [register, setRegister] = useState(false);
  const [loginError, setLoginError] = useState(false)

  const submitHandler = async e => {
    if (register) {
      let user = {
        name: formData.name,
        surname: formData.surname,
        email: formData.email,
        categories: [],
        transactions: [],
        periodical_transactions: [],
        balance: 0.0
      }
      let userToRegister = {
        user: user,
        password: formData.password
      }
      axios.post(url + "/api/users", userToRegister)
      .then(res => {
        console.log(res.data.user)
        user = res.data.user
        let id = res.data.id
        user.id = id
        setUser(user)
        saveUser(user)
        props.setTrigger(false);
        setLoginError(false)
        navigate("/main");
      })
      .catch(err => {
        console.log("error" + err)
        setLoginError(true)    
      })
    } else {
      const userToLogin = {
        email: formData.email,
        password: formData.password
      }
      axios.post(url + "/token", userToLogin)
      .then(res => {
        Cookies.set("token", res.data.access_token)
        const headers = {
          Authorization: `Bearer ${res.data.access_token}`
        }
        axios.get(url + "/users/me", {headers})
        .then(res => {
          res.data.id = res.data._id
          setUser(res.data)
          saveUser(res.data)
          props.setTrigger(false)
          setLoginError(false)
          navigate('/main')
        })
        .catch(err => {
          console.log(err)
          setLoginError(true)
        })
      })
      .catch(err => {
        console.log(err)
        setLoginError(true)
      })
    }
  }

  const classes = useStyles()

  return (
    <Card className={classes.popup}>
      <CardContent className={classes.innerPopup}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormLabel>Register</FormLabel>
            <Switch label="Register" color='primary' checked={register} onClick={(e) => setRegister(!register)}/>
          </Grid>
          {
            register ?
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField type="name" label="Name" fullWidth value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value})}/>
              </FormControl>
              <FormControl fullWidth>
                <TextField type="surname" label="Surname" fullWidth value={formData.surname}
                  onChange={(e) => setFormData({ ...formData, surname: e.target.value})}/>
              </FormControl>
            </Grid>
             : ""
          }
          {
            loginError ?
            <Alert severity="error">Wrong username or password</Alert>
            :
            ""
          }
          <Grid item xs={12}>
            <FormControl fullWidth color='primary'>
              <TextField type="email" label="Email" fullWidth value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value})}/>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField type="password" label="Password" fullWidth value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value})}/>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button className={classes.button} variant="outlined" color="primary" fullWidth onClick={submitHandler}>
              {register ? 'create account' : 'login'}
            </Button>
          </Grid>
        </Grid>
        
      </CardContent>
    </Card>
  );
}

export default LoginPopup