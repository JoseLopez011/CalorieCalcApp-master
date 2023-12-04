import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import { fetchUserData } from '../firebase';
import { calculateTotalCaloriesNeeded } from './CalorieCalculations';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome5'; // Assuming you are using FontAwesome5 icons

const HomeScreen = ({ navigation }) => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [caloriesBurned, setCaloriesBurned] = useState(null);
    const [totalCaloriesNeeded, setTotalCaloriesNeeded] = useState(null);
    const [exerciseType, setExerciseType] = useState('');
    const [exerciseDuration, setExerciseDuration] = useState('');
    const [weightInput, setWeightInput] = useState('');
    const [loggedWeights, setLoggedWeights] = useState([]);
    const [loggedExercises, setLoggedExercises] = useState([]);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);

                try {
                    const userData = await fetchUserData(user.uid);
                    setUserData(userData);

                    const totalCalories = calculateTotalCaloriesNeeded(userData);
                    setTotalCaloriesNeeded(totalCalories);
                } catch (error) {
                    console.error('Error fetching user data:', error.message);
                }
            } else {
                setUser(null);
                navigation.replace('Login');
            }
        });

        return () => unsubscribe();
    }, [navigation]);

    const handleExerciseInput = () => {
        if (exerciseType !== '' && exerciseDuration !== '') {
            setLoggedExercises([
                ...loggedExercises,
                { type: exerciseType, duration: exerciseDuration, date: new Date().toLocaleDateString() },
            ]);
            setExerciseType('');
            setExerciseDuration('');
        }
    };

    const handleWeightInput = () => {
        if (weightInput !== '') {
            setLoggedWeights([...loggedWeights, { weight: weightInput, date: new Date().toLocaleDateString() }]);
            setWeightInput('');
        }
    };

    const renderWeightHistory = () => {
        return (
            <View style={styles.loggedWeightsContainer}>
                <Text style={styles.loggedWeightsTitle}>Weight History</Text>
                {loggedWeights.map((entry, index) => (
                    <Text key={index} style={styles.loggedWeightEntry}>
                        {entry.date}: {entry.weight} kg
                    </Text>
                ))}
            </View>
        );
    };

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => navigation.navigate('Dashboard')}
            >
                <Icon name="home" size={24} color="#FFF" />
            </TouchableOpacity>

            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Calorie Tracker</Text>
                <Text style={styles.calorieText}>Total Calories Needed: {totalCaloriesNeeded || 'Calculating...'}</Text>
                <Text style={styles.calorieText}>Total Calories Burned: {caloriesBurned || 'Calculating...'}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Exercise Tracker</Text>
                <View style={styles.inputContainer}>
                    <Picker
                        selectedValue={exerciseType}
                        onValueChange={(itemValue) => setExerciseType(itemValue)}
                        style={styles.dropdown}
                    >
                        <Picker.Item label="Select Exercise" value="" />
                        <Picker.Item label="Weight Lifting" value="weightLifting" />
                        <Picker.Item label="Biking" value="biking" />
                        <Picker.Item label="Treadmill" value="treadmill" />
                    </Picker>
                    <TextInput
                        style={styles.input}
                        placeholder="Duration (minutes)"
                        value={exerciseDuration}
                        onChangeText={(text) => setExerciseDuration(text)}
                        keyboardType="numeric"
                    />
                </View>
                <TouchableOpacity onPress={handleExerciseInput} style={styles.button}>
                    <Text style={styles.buttonText}>Log Exercise</Text>
                </TouchableOpacity>
                <View style={styles.loggedExercisesContainer}>
                    <Text style={styles.loggedExercisesTitle}>Logged Exercises</Text>
                    {loggedExercises.map((entry, index) => (
                        <Text key={index} style={styles.loggedExerciseEntry}>
                            {entry.date}: {entry.type} for {entry.duration} minutes
                        </Text>
                    ))}
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Weight Tracker</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Weight (kg)"
                        value={weightInput}
                        onChangeText={(text) => setWeightInput(text)}
                        keyboardType="numeric"
                    />
                </View>
                <TouchableOpacity onPress={handleWeightInput} style={styles.button}>
                    <Text style={styles.buttonText}>Log Weight</Text>
                </TouchableOpacity>
                {renderWeightHistory()}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    iconContainer: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 1,
    },
    headerContainer: {
        padding: 20,
        backgroundColor: '#333',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 10,
    },
    calorieText: {
        fontSize: 16,
        color: '#FFF',
        marginBottom: 8,
    },
    section: {
        backgroundColor: '#424242',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 12,
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    input: {
        flex: 1,
        backgroundColor: '#212121',
        height: 40,
        paddingHorizontal: 10,
        borderRadius: 5,
        color: '#FFF',
        fontSize: 16,
    },
    dropdown: {
        flex: 1,
        height: 40,
        backgroundColor: '#212121',
        borderRadius: 5,
        color: '#FFF',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#009688',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
    },
    loggedExercisesContainer: {
        marginTop: 20,
    },
    loggedExercisesTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 10,
    },
    loggedExerciseEntry: {
        color: '#FFF',
        marginBottom: 8,
        fontSize: 14,
    },
    loggedWeightsContainer: {
        marginTop: 20,
    },
    loggedWeightsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 10,
    },
    loggedWeightEntry: {
        color: '#FFF',
        marginBottom: 8,
        fontSize: 14,
    },
});

export default HomeScreen;
