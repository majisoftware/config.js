import React from 'react'
import PropTypes from 'prop-types'

const ErrorPage = props => (
  <div className='ErrorPage'>
    <h1>Whoops!</h1>
    <h2>{props.error.message}</h2>
  </div>
)

ErrorPage.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string.isRequired
  }).isRequired
}

export default ErrorPage
