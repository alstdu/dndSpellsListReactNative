import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useMemo } from 'react';

const SpellTable = () => {
  const [spells, setSpells] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSpell, setExpandedSpell] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://www.dnd5eapi.co/api/spells')
      .then(response => {
        // fetch details for each spell using the URL
        const spellPromises = response.data.results.map(spell => 
          axios.get(`https://www.dnd5eapi.co${spell.url}`)
            .then(spellDetails => spellDetails.data)
        );
        Promise.all(spellPromises)
          .then(fullSpells => {
            setSpells(fullSpells);
            setLoading(false); // turn off loading indicator after loading complete
          })
          .catch(error => {
            console.error('Error fetching spell details:', error);
            setLoading(false);
          });
      })
      .catch(error => {
        console.error('Error fetching spells:', error);
        setLoading(false);
      });
  }, []);
// used to manage the spell expansion state
//     will be used to show the spell description
  const toggleExpand = (index) => {
    setExpandedSpell(expandedSpell === index ? null : index);
  };

  const renderSpell = useMemo(() => ({ item, index }) => (
    <View>
      {/* allows each row to be pressable */}
      <TouchableOpacity onPress={() => toggleExpand(index)}>
        {/* insert information from api */}
        <View style={styles.row}>
          <Text style={styles.cell}>{item.name}</Text>
          <Text style={styles.cell}>{item.level}</Text>
          <Text style={styles.cell}>{item.casting_time}</Text>
          <Text style={styles.cell}>{item.school.name}</Text>
          <Text style={styles.cell}>{item.range}</Text>
        </View>
      </TouchableOpacity>
      {/* ensures that spell descriptions are displayed only when their corresponding spell row is expanded */}
      {expandedSpell === index && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{item.desc.join('\n\n')}</Text>
        </View>
      )}
    </View>
  ), [expandedSpell, toggleExpand]);

// filter the spells based on user input
  const filteredSpells = spells.filter(spell => 
    spell.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* TextInput for spell name search */}
      <TextInput
        style={styles.searchInput}
        placeholder="Enter a Spell Name"
        value={searchQuery}
        onChangeText={text => setSearchQuery(text)}
      />
      {/* loading indicator when loading spells */}
      {loading ? (
        <ActivityIndicator size="large" color="#c78c6e" />
      ) : (
        <View style={styles.table}>
          {/* row headers */}
          <View style={styles.headerRow}>
            <Text style={styles.headerCell}>Name</Text>
            <Text style={styles.headerCell}>Level</Text>
            <Text style={styles.headerCell}>Time</Text>
            <Text style={styles.headerCell}>School</Text>
            <Text style={styles.headerCell}>Range</Text>
          </View>
          {/* create FlatList for rendering filtered spells */}
          <FlatList
            data={filteredSpells}
            renderItem={renderSpell}
            keyExtractor={item => item.index}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5e0d3',
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 10,
    marginTop: 40,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  table: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#c78c6e',
  },
  headerCell: {
    flex: 1,
    padding: 10,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
  },
  cell: {
    flex: 1,
    padding: 10,
    textAlign: 'center',
    color: '#333',
  },
  descriptionContainer: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  description: {
    color: '#333',
  },
});

export default SpellTable;
