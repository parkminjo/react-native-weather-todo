import { theme } from '@/constants/color';
import { Todo } from '@/types/types';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const App = () => {
  const [isWorking, setIsWorking] = useState(true);
  const [todos, setTodos] = useState<Record<string, Todo>>({});
  const [text, setText] = useState('');

  const work = () => setIsWorking(true);
  const travel = () => setIsWorking(false);

  const handleChangeText = (payload: string) => setText(payload);
  const addTodo = () => {
    if (text === '') return;

    // const newTodo = Object.assign({}, todos, { [Date.now()]: { text, isWorking } });
    const newTodo = { ...todos, [Date.now()]: { text, isWorking } };

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
      <ScrollView>
        {Object.keys(todos).map((key) => (
          <View key={key} style={styles.todoItem}>
            <Text style={styles.todoText}>{todos[key].text}</Text>
          </View>
        ))}
      </ScrollView>
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
    marginVertical: 20,
    fontSize: 16,
  },
  todoItem: {
    backgroundColor: theme.todoBg,
    marginBottom: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  todoText: { color: 'white', fontSize: 16 },
});
