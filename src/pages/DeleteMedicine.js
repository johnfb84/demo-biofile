import React, { useState } from 'react';
import { View, Alert, SafeAreaView } from 'react-native';
import Mytextinput from './components/Mytextinput';
import Mybutton from './components/Mybutton';
import { DatabaseConnection } from '../database/database-connection';

const db = DatabaseConnection.getConnection();

const DeleteMedicine = ({ navigation }) => {
  let [inputMedId, setInputMedId] = useState('');

  let deleteMedicine = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM  table_medicine where med_id=?',
        [inputMedId],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Biofile',
              'Medicamento borrado con exito !',
              [
                {
                  text: 'Ok',
                  onPress: () => navigation.navigate('HomeScreen'),
                },
              ],
              { cancelable: false }
            );
          } else {
            alert('Ingrese un codigo de medicamento valido!');
          }
        }
      );
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ flex: 1 }}>
          <Mytextinput
            placeholder="Ingrese un codigo de medicamento valido"
            onChangeText={
              (inputMedId) => setInputMedId(inputMedId)
            }
            style={{ padding: 10 }}
          />
          <Mybutton title="Borrar medicamento" customClick={deleteMedicine} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DeleteMedicine;