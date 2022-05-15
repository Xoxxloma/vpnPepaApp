import { StyleSheet } from 'react-native'

export default StyleSheet.create({
    secondaryPageContainer: {
      flex: 1,
      backgroundColor: 'black',
      flexDirection: 'column',
      paddingHorizontal: 20,
    },
    orangeBorder: {
      borderColor: 'rgba(217, 85, 13, 1)',
    },
    logoContainer: {
      borderRadius: 200 / 2,
      width: 200,
      height: 200,
      borderWidth: 30,
    },
    logo: {
      borderRadius: 200 / 2,
      width: '100%',
      height: '100%'
    },
    label: {
      fontFamily: 'TitilliumWeb-Regular',
      color: 'white',
      fontSize: 48,
      marginBottom: 10
    },
})
