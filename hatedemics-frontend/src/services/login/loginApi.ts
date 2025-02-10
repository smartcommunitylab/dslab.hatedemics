import axios from '../api'
import router from '@/router'
import { useLoginStore } from '@/store/LoginStore'


 async function logout() {
    const loginStore = useLoginStore()
    loginStore.removeAll()
    router.push({ name: 'login' })
  }
  async function login(username:string, password:string) {
    return axios.post(
      '/token',
      {
        username: username,
        password: password
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
  }

  async function getUsers() {
    return axios.get('/users/')
  }

  //Returns '201 created' if successful
  async function createUser(email:string, username:string, password:string) {
    return axios.post('/users/', {
      email: email,
      username: username,
      password: password
    })
  }

  async function editUser(email:string, username:string, password:string, userID:string) {
    return axios.patch(String('/users/' + userID + '/edit/'), {
      email: email,
      username: username,
      password: password
    })
  }

  //Returns '204 no content' if successful
  async function changePassword(oldPassword:string, newPassword:string) {
    return axios.patch(
      '/users/me/changepassword?old_password=' + oldPassword + '&new_password=' + newPassword
    )
  }
  async  function isAuthenticated() {
    axios
      .get('/users/me')
      .then(function () {
        // console.log('true')
        return true
      })
      .catch(function () {
        // console.log('false')
        return false
      })
  }
export default {
  login,
  logout,
  getUsers,
  createUser,
  editUser,
  changePassword,
  isAuthenticated
};
