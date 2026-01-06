import { theme } from '@/constants/color';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const App = () => {
  const [isWorking, setIsWorking] = useState(true);
  const [todos, setTodos] = useState({});
  const [text, setText] = useState('');

  const work = () => setIsWorking(true);
  const travel = () => setIsWorking(false);

  const handleChangeText = (payload: string) => setText(payload);
  const addTodo = () => {
    if (text === '') return;

    const newTodo = Object.assign({}, todos, { [Date.now()]: { text, isWorking } });

    setTodos(newTodo);
    setText('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{ ...styles.btnText, color: isWorking ? 'white' : 'gray' }}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={{ ...styles.btnText, color: !isWorking ? 'white' : 'gray' }}>Travel</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
          value={text}
          onChangeText={handleChangeText}
          onSubmitEditing={addTodo}
          style={styles.input}
          placeholder={isWorking ? 'Add a Todo' : 'Where do you want to go?'}
          returnKeyType="done"
        />
      </View>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg, paddingHorizontal: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  btnText: { fontSize: 38, fontWeight: '600', color: 'white' },
  input: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 10,
    fontSize: 16,
  },
});
