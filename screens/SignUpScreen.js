import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // Assuming firebase.js is in the '../firebase' directory
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';

const SignUpScreen = ({ navigation }) => {
    // State variables for user input
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [age, setAge] = useState('18');
    const [gender, setGender] = useState('Not Specified');
    const [feet, setFeet] = useState('');
    const [inches, setInches] = useState('');
    const [weight, setWeight] = useState('150');
    const [activityLevel, setActivityLevel] = useState('Moderate');
    const [goals, setGoals] = useState('Weight Loss');
    const [loading, setLoading] = useState(false);

    // Function to handle user sign up
    const handleSignUp = () => {
        setLoading(true);

        // Check if passwords match
        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            setLoading(false);
            return;
        }

        // Create user with email and password
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredentials) => {
                const user = userCredentials.user;
                // Log additional user information
                console.log('Registered with:', user.email);
                console.log('Additional information:');
                console.log('Name:', name);
                console.log('Age:', age);
                console.log('Gender:', gender);
                console.log('Height:', feet + ' feet ' + inches + ' inches');
                console.log('Weight:', weight + ' lbs');
                console.log('Activity Level:', activityLevel);
                console.log('Goals:', goals);
                // Store this information in your database as needed.
            })
            .catch((error) => alert(error.message))
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <View style={styles.inputContainer}>
                {/* Input fields for user registration */}
                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    style={styles.input}
                    secureTextEntry
                />
                <TextInput
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={(text) => setConfirmPassword(text)}
                    style={styles.input}
                    secureTextEntry
                />
                <TextInput
                    placeholder="Name"
                    value={name}
                    onChangeText={(text) => setName(text)}
                    style={styles.input}
                />
                {/* Picker for age selection */}
                <Picker
                    selectedValue={age}
                    onValueChange={(itemValue, itemIndex) => setAge(itemValue)}
                >
                    {Array.from({ length: 100 }, (_, i) => (
                        <Picker.Item key={i} label={`${i + 1}`} value={`${i + 1}`} />
                    ))}
                </Picker>
                {/* Picker for gender selection */}
                <Picker
                    selectedValue={gender}
                    onValueChange={(itemValue, itemIndex) => setGender(itemValue)}
                >
                    <Picker.Item label="Not Specified" value="Not Specified" />
                    <Picker.Item label="Male" value="Male" />
                    <Picker.Item label="Female" value="Female" />
                </Picker>
                {/* Input fields for height */}
                <View style={styles.heightInput}>
                    <TextInput
                        placeholder="Feet"
                        value={feet}
                        onChangeText={(text) => setFeet(text)}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Inches"
                        value={inches}
                        onChangeText={(text) => setInches(text)}
                        style={styles.input}
                    />
                </View>
                {/* Slider for weight selection */}
                <Slider
                    value={parseFloat(weight)}
                    onValueChange={(value) => setWeight(value.toFixed(0))}
                    minimumValue={0}
                    maximumValue={400}
                    step={1}
                />
                {/* Pickers for activity level and goals */}
                <Picker
                    selectedValue={activityLevel}
                    onValueChange={(itemValue, itemIndex) => setActivityLevel(itemValue)}
                >
                    <Picker.Item label="Low" value="Low" />
                    <Picker.Item label="Moderate" value="Moderate" />
                    <Picker.Item label="High" value="High" />
                </Picker>
                <Picker
                    selectedValue={goals}
                    onValueChange={(itemValue, itemIndex) => setGoals(itemValue)}
                >
                    <Picker.Item label="Weight Loss" value="Weight Loss" />
                    <Picker.Item label="Maintenance" value="Maintenance" />
                    <Picker.Item label="Muscle Gain" value="Muscle Gain" />
                </Picker>
            </View>
            {/* Button container */}
            <View style={styles.buttonContainer}>
                {/* Register button */}
                <TouchableOpacity onPress={handleSignUp} style={styles.button}>
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
                {/* Back to Login button */}
                <TouchableOpacity
                    onPress={() => navigation.navigate('Login')}
                    style={[styles.button, styles.buttonOutline]}
                >
                    <Text style={styles.buttonOutlineText}>Back to Login</Text>
                </TouchableOpacity>
            </View>
            {/* Loading indicator */}
            {loading && <ActivityIndicator size="large" color="#0782F9" />}
        </KeyboardAvoidingView>
    );
};

export default SignUpScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        width: '80%',
    },
    heightInput: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    button: {
        backgroundColor: '#0782F9',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonOutline: {
        backgroundColor: 'white',
        marginTop: 5,
        borderColor: '#0782F9',
        borderWidth: 2,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    buttonOutlineText: {
        color: '#0782F9',
        fontWeight: '700',
        fontSize: 16,
    },
});
