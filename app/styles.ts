import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#cdeff1', // Primary color
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#fca590', // Tertiary color
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
    backgroundColor: '#fefea2', // Secondary color
  },
  button: {
    marginVertical: 10,
    width: '100%',
  },
  buttonText: {
    color: '#fca590', // Tertiary color
  },
  label: {
    alignSelf: 'flex-start',
    marginBottom: 5,
    color: '#fca590', // Tertiary color
  },
}); 