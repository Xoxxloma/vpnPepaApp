import React from 'react'
import {BaseToast} from 'react-native-toast-message';

export const toastConfig = {
  warning: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#D9550D'
      }}
    />
  )
}
