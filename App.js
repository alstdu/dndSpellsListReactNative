import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import SpellTable from './components/SpellTable';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <SpellTable />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;
