import React, { useState, useEffect } from 'react';
import { FlatList, Text, View, SafeAreaView, StyleSheet } from 'react-native';
import { DatabaseConnection } from '../database/database-connection';

const db = DatabaseConnection.getConnection();

const ViewAllMedicine = () => {
  let [flatListItems, setFlatListItems] = useState([]);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM table_medicine',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setFlatListItems(temp);
        }
      );
    });
  }, []);

  let listItemView = (item) => {
    return (
      <View
        key={item.med_id}
        style={{ backgroundColor: '#EEE', marginTop: 20, padding: 30, borderRadius: 10 }}>
        <Text style={styles.textheader}>Codigo</Text>
        <Text style={styles.textbottom}>{item.med_id}</Text>

        <Text style={styles.textheader}>Nombre</Text>
        <Text style={styles.textbottom}>{item.med_name}</Text>

        <Text style={styles.textheader}>Dosis</Text>
        <Text style={styles.textbottom}>{item.dosis}</Text>

        <Text style={styles.textheader}>Instrucciones médicas</Text>
        <Text style={styles.textbottom}>{item.med_instructions}</Text>


      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ flex: 1 }}>
          <FlatList
            style={{ marginTop: 30 }}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            data={flatListItems}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => listItemView(item)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  textheader: {
    color: '#111',
    fontSize: 12,
    fontWeight: '700',

  },
  textbottom: {
    color: '#111',
    fontSize: 18,
  },
});

export default ViewAllMedicine;