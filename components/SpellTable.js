import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';

const SpellTable = () => {
  const [spells, setSpells] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSpell, setExpandedSpell] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios.get('https://www.dnd5eapi.co/api/spells')
      .then(response => {
        const spellPromises = response.data.results.map(spell => 
          axios.get(`https://www.dnd5eapi.co${spell.url}`)
            .then(spellDetails => spellDetails.data)
        );
        Promise.all(spellPromises)
          .then(fullSpells => {
            setSpells(fullSpells);
            setLoading(false);
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

  const toggleExpand = (index) => {
    setExpandedSpell(expandedSpell === index ? null : index);
  };
  const renderSpell = ({ item, index }) => (
    <View>
      <TouchableOpacity onPress={() => toggleExpand(index)}>
        <View style={styles.row}>
          <Text style={styles.cell}>{item.name}</Text>
          <Text style={styles.cell}>{item.level}</Text>
          <Text style={styles.cell}>{item.casting_time}</Text>
          <Text style={styles.cell}>{item.school.name}</Text>
          <Text style={styles.cell}>{item.range}</Text>
        </View>
      </TouchableOpacity>
      {expandedSpell === index && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{item.desc.join(' ')}</Text>
        </View>
      )}
    </View>
  );

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
      {loading ? (
        <ActivityIndicator size="large" color="#c78c6e" />
      ) : (
        <View style={styles.table}>
          <View style={styles.headerRow}>
            <Text style={styles.headerCell}>Name</Text>
            <Text style={styles.headerCell}>Level</Text>
            <Text style={styles.headerCell}>Time</Text>
            <Text style={styles.headerCell}>School</Text>
            <Text style={styles.headerCell}>Range</Text>
          </View>
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
