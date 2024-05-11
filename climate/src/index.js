import { Alert, SafeAreaView, Text, View ,StyleSheet, ActivityIndicator, ScrollView ,RefreshControl} from 'react-native'
import React, { useEffect,useState } from 'react'
import * as Location from 'expo-location'


const openWeatherKey = '377a24b222528b77c87f4c7cd815df85'
let url = `https://api.openweathermap.org/data/3.0/onecall&units=metric&exclude=minutely&appid=${openWeatherKey}`

const Weather = () => {

    const[forecast,setForecast] = useState(null)
    const[refreshing,setRefreshing] = useState(false)

    const loadForecast = async () => {
        setRefreshing = true
        const {status} = await Location.requestForegroundPermissionsAsync()
        if(status !== 'granted') {
            Alert.alert('Permission to access location denied')
        }

        let location = await Location.getCurrentPositionAsync({enableHighAccuracy:true})

        const response = await fetch(`${url}&lat=${location.coords.latitude}&lon=${location.coords.longitude}`)
        const data = await response.json()

        if(!response.ok) {
            Alert.alert('error, something gone wrong...')
        }
        else {
            setForecast(data)
        }
        setRefreshing(false)
    }

    useEffect(()=>{
        loadForecast()
    },[])

    if(!forecast) {
        return (
            <SafeAreaView style={styles.loading}>
                <ActivityIndicator size='large'/>
            </SafeAreaView>
        )
    }


    const current = forecast.current.weather[0]


  
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
            refreshControl = {
                <RefreshControl refreshing={refreshing} onRefresh={()=>loadForecast()}/>
            }
            style={{margintop:50}}
            <Text style={styles.title}>
                Current Weather
            </Text>
            <Text style={{alignItems:'center',textAlign:'center'}}>
                Your Location
            </Text>
            <View>

            </View>
        </ScrollView>
      </SafeAreaView>
    )
}

export default Weather

const styles = StyleSheet.create({
    title = {
        
    }
})