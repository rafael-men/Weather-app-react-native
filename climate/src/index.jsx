import { Alert, SafeAreaView, Text, View, StyleSheet, ActivityIndicator, ScrollView, RefreshControl, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';

let apiKey = 'ae650679d60ea4bd1187faeba1c0e03e'
let url = `https://api.openweathermap.org/data/2.5/weather?q=Aracaju&appid=${apiKey}&units=metric`;

const Weather = () => {
    const [forecast, setForecast] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const loadForecast = async () => {
        setRefreshing(true);
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission to access location denied');
            setRefreshing(false);
            return;
        }

        let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });

        const response = await fetch(`${url}&lat=${location.coords.latitude}&lon=${location.coords.longitude}`);
        const data = await response.json();

        if (!response.ok) {
            Alert.alert('Error', 'Something went wrong...');
        } else {
            setForecast(data);
        }
        setRefreshing(false);
    };

    useEffect(() => {
        loadForecast();
    }, []);

    if (!forecast) {
        return (
            <SafeAreaView style={styles.loading}>
                <ActivityIndicator size='large' />
            </SafeAreaView>
        );
    }

    const current = forecast.current.weather[0];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={loadForecast} />
                }
                style={{ marginTop: 50 }}>
                <Text style={styles.title}>
                    Current Weather
                </Text>
                <Text style={{ alignItems: 'center', textAlign: 'center' }}>
                    Your Location
                </Text>
                <View style={styles.current}>
                    <Image style={styles.largeIcon} source={{
                        uri: `http://openweathermap.org/img/wn/${current.icon}@4x.png`
                    }}
                    />
                    <Text style={styles.currentTemp}>
                        {Math.round(forecast.current.temp)}ºC
                    </Text>
                </View>
                <Text style={styles.currentDesc}>
                    {current.description}
                </Text>
                <View style={styles.extraInfo}>
                    <View style={styles.info}>
                        <Image/>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Weather;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ECDBBA',
    },
    title: {
        textAlign: 'center',
        fontSize: 36,
        fontWeight: 'bold',
        color: '#C84B31'
    },
    current: {
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center'
    },
    largeIcon: {
        width:300,
        height:250
    },
    currentTemp: {
        fontSize:32,
        fontWeight:'bold',
        textAlign:'center'
    },
    currentDesc: {
        width:'100%',
        textAlign: 'center',
        fontWeight:'200',
        fontSize:24,
        marginBottom:5
    }
});
