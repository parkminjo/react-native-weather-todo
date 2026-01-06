import { theme } from '@/constants/color';
import { Todo } from '@/types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const App = () => {
  const [isWorking, setIsWorking] = useState(true);
  const [todos, setTodos] = useState<Record<string, Todo>>({});
  const [text, setText] = useState('');

  const work = () => setIsWorking(true);
  const travel = () => setIsWorking(false);

  const handleChangeText = (payload: string) => setText(payload);

  const saveTodos = async (todos: Record<string, Todo>) => {
    await AsyncStorage.setItem('todos', JSON.stringify(todos));
  };

  const loadTodos = async () => {
    try {
      const response = await AsyncStorage.getItem('todos');
      if (response === null) throw new Error('No todos found');

      const data = JSON.parse(response);
      setTodos(data);
    } catch (error) {
      console.log(error);
    }
  };

  const addTodo = async () => {
    if (text === '') return;

    // const newTodo = Object.assign({}, todos, { [Date.now()]: { text, isWorking } });
    const newTodos = { ...todos, [Date.now()]: { text, isWorking } };

    setTodos(newTodos);
    await saveTodos(newTodos);
    setText('');
  };

  useEffect(() => {
    loadTodos();
  }, [todos]);
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
        {Object.keys(todos).map((key) =>
          todos[key].isWorking === isWorking ? (
            <View key={key} style={styles.todoItem}>
              <Text style={styles.todoText}>{todos[key].text}</Text>
            </View>
          ) : null
        )}
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
