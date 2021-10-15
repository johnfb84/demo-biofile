import React, { useEffect } from 'react';
import { View, SafeAreaView, Image, StyleSheet } from 'react-native';
import MyImageButton from './components/MyImageButton';
import { DatabaseConnection } from '../database/database-connection';
import logo from '../../assets/logo.png';

const db = DatabaseConnection.getConnection();

const HomeScreen = ({ navigation }) => {
  useEffect(() => {
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='table_medicine'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS table_medicine', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS table_medicine(med_id INTEGER PRIMARY KEY AUTOINCREMENT, med_name VARCHAR(20), dosis INT(10), med_instructions VARCHAR(255))',
              []
            );
          }
        }
      );
    });
  }, []);

  const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>

            <View style={styles.container}>
                <Image
                    source={logo}
                />
            </View>
            {/* <Image source={logo} style={{ alignItems: 'center'}} />  */}
            <MyImageButton
              title="Registrar Medicamento"
              btnColor='#2992C4'
              btnIcon="user-plus"
              customClick={() => navigation.navigate('RegisterMedicine')}
            />
            <MyImageButton
              title="Actualizar Medicamento"
              btnColor='#2992C4'
              btnIcon="user-circle"
              customClick={() => navigation.navigate('UpdateMedicine')}
            />
            <MyImageButton
              title="Visualizar Medcamentos"
              btnColor='#2992C4'
              btnIcon="users"
              customClick={() => navigation.navigate('ViewAllMedicine')}
            />
            <MyImageButton
              title="Buscar Medicamento"
              btnColor='#2992C4'
              btnIcon="user"
              customClick={() => navigation.navigate('ViewMedicine')}
            />
            <MyImageButton
              title="Borrar Medicamento"
              btnColor='#D1503A'
              btnIcon="user-times"
              customClick={() => navigation.navigate('DeleteMedicine')}
            />
          </View>
        </View>


      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;