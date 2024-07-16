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
