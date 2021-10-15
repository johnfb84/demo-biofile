import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  SafeAreaView,
} from 'react-native';
import Mytextinput from './components/Mytextinput';
import Mybutton from './components/Mybutton';
import { DatabaseConnection } from '../database/database-connection';
import DateTimePicker from '@react-native-community/datetimepicker';
import Mytext from './components/Mytext';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

const db = DatabaseConnection.getConnection();

const RegisterMedicine = ({ navigation }) => {
  let [medName, setMedName] = useState('');
  let [dosis, setDosis] = useState('');
  let [medInstructions, setMedInstructions] = useState('');
  let [date, setDate] = useState(new Date());
  const [show, setShow] = useState(true);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    console.log("fecha cambia a: " + currentDate);
    date=currentDate;
  };
  
  const handleNotification = () => {
    console.warn('Recordatorio para tomar medicamento.');
  };

  const askNotification = async () => {
    // We need to ask for Notification permissions for ios devices
    const { status } = await await Notifications.requestPermissionsAsync();
    if (Constants.isDevice && status === 'granted')
      console.log('Notification permissions granted.');
  };

  let register_user = () => {
    
    console.log(medName, dosis, medInstructions);
    console.log("fecha para notificaion es: " + date);
    const fechaActual = new Date();
    const diff = date - fechaActual;
    const seconds = Math.floor(diff / 1000);
    console.log("La fecha actual es: " + fechaActual);
    console.log("La fecha seleccionada es: " + date);
    console.log("Diferencia en seg: " + seconds);

    const schedulingOptions = {
      content: {
        title: 'Biofile',
        body: 'Recordatorio para tomar medicamento.',
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        color: "blue"
      },
      trigger: {
        seconds: seconds,
        //Si se quiere repetir el recordatorio
        // repeats: true,
      },
    };
    // Notifications show only when app is not active.
    // (ie. another app being used or device's screen is locked)
    Notifications.scheduleNotificationAsync(
      schedulingOptions,
    );

    if (!medName) {
      alert('Ingrese el nombre del medicamento!');
      return;
    }
    if (!dosis) {
      alert('Ingrese la dosis');
      return;
    }
    if (!medInstructions) {
      alert('Ingrese las instrucciones médicas!');
      return;
    }

    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO table_medicine (med_name, dosis, med_instructions) VALUES (?,?,?)',
        [medName, dosis, medInstructions],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Biofile',
              'Medicamento registrado con exito!!!',
              [
                {
                  text: 'Ok',
                  onPress: () => navigation.navigate('HomeScreen'),
                },
              ],
              { cancelable: false }
            );
          } else alert('Error al intentar registrar el medicamento!!!');
        }
      );
    });
  };

  useEffect(() => {
    askNotification();
    // If we want to do something with the notification when the app
    // is active, we need to listen to notification events and
    // handle them in a callback
    const listener = Notifications.addNotificationReceivedListener(handleNotification);
    return () => listener.remove();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ flex: 1 }}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <KeyboardAvoidingView
              behavior="padding"
              style={{ flex: 1, justifyContent: 'space-between' }}>
              <Mytextinput
                placeholder="Nombre del medicamento"
                onChangeText={
                  (medName) => setMedName(medName)
                }
                style={{ padding: 10 }}
              />
              <Mytextinput
                placeholder="Dosis"
                onChangeText={
                  (dosis) => setDosis(dosis)
                }
                maxLength={10}
                keyboardType="numeric"
                style={{ padding: 10 }}
              />
              <Mytextinput
                placeholder="Instrucciones médicas"
                onChangeText={
                  (medInstructions) => setMedInstructions(medInstructions)
                }
                maxLength={225}
                numberOfLines={5}
                multiline={true}
                style={{ textAlignVertical: 'top', padding: 10 }}
              />

              <Mytext text="Hora y fecha del recordatorio:" />
               <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={onChange}
              />
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={onChange}
              />
              <Mybutton title="Guardar" customClick={register_user} />
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RegisterMedicine;