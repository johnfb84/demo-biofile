import React, { useState } from 'react';
import { Text, View, SafeAreaView } from 'react-native';
import Mytext from './components/Mytext';
import Mytextinput from './components/Mytextinput';
import Mybutton from './components/Mybutton';
import { DatabaseConnection } from '../database/database-connection';

const db = DatabaseConnection.getConnection();

const ViewMedicine = () => {
  let [inputMedId, setInputMedId] = useState('');
  let [medData, setMedData] = useState({});

  let searchMedicine = () => {
    console.log(inputMedId);
    setMedData({});
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM table_medicine where med_id = ?',
        [inputMedId],
        (tx, results) => {
          var len = results.rows.length;
          console.log('len', len);
          if (len > 0) {
            setMedData(results.rows.item(0));
          } else {
            alert('Medicamento no encontrado !');
          }
        }
      );
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ flex: 1 }}>
          <Mytext text="Buscar medicamentos" />
          <Mytextinput
            placeholder="Ingrese un codigo de medicamento"
            onChangeText={
              (inputMedId) => setInputMedId(inputMedId)
            }
            style={{ padding: 10 }}
          />
          <Mybutton title="Buscar Medicamento" customClick={searchMedicine} />
          <View
            style={{
              marginLeft: 35,
              marginRight: 35,
              marginTop: 10
            }}>
            <Text>Código : {medData.med_id}</Text>
            <Text>Nombre : {medData.med_name}</Text>
            <Text>Dosis : {medData.dosis}</Text>
            <Text>Instrucciones medicas : {medData.med_instructions}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ViewMedicine;