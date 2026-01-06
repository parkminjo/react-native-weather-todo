import { theme } from '@/constants/color';
import { TABS } from '@/constants/tab';
import { Todo } from '@/types/types';
import Fontisto from '@expo/vector-icons/Fontisto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const App = () => {
  const [isWorking, setIsWorking] = useState(true);
  const [todos, setTodos] = useState<Record<string, Todo>>({});
  const [text, setText] = useState('');

  const work = () => {
    setIsWorking(true);
    saveSelectedTab(TABS.WORK);
  };
  const travel = () => {
    setIsWorking(false);
    saveSelectedTab(TABS.TRAVEL);
  };

  const handleChangeText = (payload: string) => setText(payload);

  const saveSelectedTab = async (tab: keyof typeof TABS) => {
    await AsyncStorage.setItem('tab', tab);
  };

  const loadTab = async () => {
    try {
      const response = await AsyncStorage.getItem('tab');
      if (response === null) throw new Error('No tab found');

      setIsWorking(response === TABS.WORK);
    } catch (error) {
      console.log(error);
    }
  };

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

  const deleteTodo = (key: string) => {
    Alert.alert('Delete Todo', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'OK',
        style: 'destructive',
        onPress: () => {
          const newTodos = { ...todos };
          delete newTodos[key];

          setTodos(newTodos);
          saveTodos(newTodos);
        },
      },
    ]);
  };

  useEffect(() => {
    loadTodos();
    loadTab();
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
              <TouchableOpacity onPress={() => deleteTodo(key)}>
                <Fontisto name="trash" size={18} color="gray" />
              </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.todoBg,
    marginBottom: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  todoText: { color: 'white', fontSize: 16 },
});
