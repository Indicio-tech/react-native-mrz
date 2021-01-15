//  Created by react-native-create-bridge

import React, { Component } from 'react'
import { requireNativeComponent } from 'react-native'

const libsvm = requireNativeComponent('libsvm', libsvmView)

export default class libsvmView extends Component {
  render () {
    return <libsvm {...this.props} />
  }
}

libsvmView.propTypes = {
  exampleProp: React.PropTypes.any
}
