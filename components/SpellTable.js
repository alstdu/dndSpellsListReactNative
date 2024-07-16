import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';

const SpellTable = () => {
  const [spells, setSpells] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSpell, setExpandedSpell] = useState(null);
  const [loading, setLoading] = useState(true);
