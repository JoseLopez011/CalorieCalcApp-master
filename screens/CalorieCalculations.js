import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { fetchUserData } from '../firebase'; // Adjust the path based on your project structure

const HomeScreen = ({ navigation }) => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [totalCaloriesNeeded, setTotalCaloriesNeeded] = useState(null);
    const [weightInput, setWeightInput] = useState('');
    const [loggedWeights, setLoggedWeights] = useState([]);

    // Function to calculate total calories needed based on user data
    const calculateTotalCaloriesNeeded = (userData) => {
        let bmr;
        const { age, gender, weight, height, activityLevel } = userData;

        if (gender === 'male') {
            bmr = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
        } else {
            bmr = 447.593 + 9.247 * weight + 3.098 * height - 4.330 * age;
        }

        // Adjust BMR based on activity level
        const activityFactors = {
            Low: 1.2,
            Moderate: 1.55,
            High: 1.9,
        };

        const totalCaloriesNeeded = Math.round(bmr * activityFactors[activityLevel]);
        return totalCaloriesNeeded;
    };

    useEffect(() => {
        // Set up Firebase authentication listener
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);

                try {
                    // Fetch user data from Firebase
                    const userData = await fetchUserData(user.uid);
                    setUserData(userData);

                    // Calculate total calories needed based on user data
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

        return () => unsubscribe(); // Cleanup on component unmount
    }, [navigation]);

    // Function to handle weight input and log it
    const handleWeightInput = () => {
        if (weightInput !== '') {
            setLoggedWeights([...loggedWeights, { weight: weightInput, date: new Date().toLocaleDateString() }]);
            setWeightInput('');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.calorieTracker}>
                <Text style={styles.sectionTitle}>Calorie Tracker</Text>
                <Text>Total Calories Needed: {totalCaloriesNeeded || 'Calculating...'}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Weight Tracker</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Weight (kg)"
                    value={weightInput}
                    onChangeText={(text) => setWeightInput(text)}
                    keyboardType="numeric"
                />
                <TouchableOpacity onPress={handleWeightInput} style={styles.button}>
                    <Text style={styles.buttonText}>Log Weight</Text>
                </TouchableOpacity>
                <View style={styles.loggedWeightsContainer}>
                    <Text style={styles.loggedWeightsTitle}>Logged Weights</Text>
                    {loggedWeights.map((entry, index) => (
                        <Text key={index} style={styles.loggedWeightEntry}>
                            {entry.date}: {entry.weight} kg
                        </Text>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2C2C2C',
    },
    calorieTracker: {
        padding: 20,
        backgroundColor: '#424242',
        borderRadius: 10,
        marginBottom: 20,
    },
    section: {
        backgroundColor: '#424242',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    input: {
        backgroundColor: '#fff',
        height: 40,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
    },
    loggedWeightsContainer: {
        marginTop: 20,
    },
    loggedWeightsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    loggedWeightEntry: {
        color: 'white',
        marginBottom: 5,
    },
});

export default HomeScreen;
