import Home from '../views/Home'
import Profile from '../views/Profile'
import Exercise from '../views/Exercise'
import UsersAdmin from '../views/admin/users/UsersAdmin'
import ExercisesAdmin from '../views/admin/exercises/ExercisesAdmin'
import OAuth2RedirectHandler from '../views/OAuth2RedirectHandler'
import NotFound from '../views/NotFound'

export default [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      allowAnonymous: true,
      title: 'Translates'
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      title: 'My profile'
    }
  },
  {
    path: '/exercises/:id',
    name: 'Exercise',
    component: Exercise,
    props: true,
    meta: {
      title: 'Exercise'
    }
  },
  {
    path: '/admin/users',
    name: 'UsersAdmin',
    component: UsersAdmin,
    meta: {
      title: 'Users'
    }
  },
  {
    path: '/admin/exercises',
    name: 'ExercisesAdmin',
    component: ExercisesAdmin,
    meta: {
      title: 'Exercises'
    }
  },
  {
    path: '/oauth2/redirect',
    name: 'OAuth2RedirectHandler',
    component: OAuth2RedirectHandler,
    meta: {
      allowAnonymous: true
    }
  },
  {
    path: '*',
    name: 'NotFound',
    component: NotFound,
    meta: {
      allowAnonymous: true,
      title: 'Page not found'
    }
  }
]