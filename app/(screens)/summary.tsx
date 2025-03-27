import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { API } from '../services/api';
import { getToken } from '../utils/storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../components/BackButton';

export default function SummaryScreen() {
  const [wordData, setWordData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const [sentiment, setSentiment] = useState<string>('Unknown');

  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken();
      const headers = { Authorization: `Bearer ${token}` };

      const [words, cats, heatmap, sent] = await Promise.all([
        API.get('/summary/wordcount', { headers }),
        API.get('/summary/categories', { headers }),
        API.get('/summary/heatmap', { headers }),
        API.get('/summary/sentiment?startDate=2024-01-01', { headers }),
      ]);

      setWordData(words.data);
      setCategoryData(cats.data);
      setHeatmapData(heatmap.data);
      setSentiment(sent.data.sentiment);
    };

    fetchData();
  }, []);

  const getBlockColor = (count: number) => {
    if (count >= 5) return '#4caf50';
    if (count >= 3) return '#81c784';
    if (count >= 1) return '#c8e6c9';
    return '#222';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <BackButton />
        <Text style={styles.title}>Your Analytics</Text>

        <Text style={styles.sectionTitle}>🧱 Entry Heatmap</Text>
        <View style={styles.heatmap}>
          {heatmapData.slice(0, 84).map((d, i) => (
            <View
              key={i}
              style={[styles.block, { backgroundColor: getBlockColor(d.count) }]}
            >
              <Text style={{ color: '#fff', fontSize: 12 }}>{d.date}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>📝 Word Count per Day</Text>
        {wordData.map((d) => (
          <Text style={styles.text} key={d.date}>
            {d.date}: {d.wordCount} words
          </Text>
        ))}

        <Text style={styles.sectionTitle}>📂 Entries per Category</Text>
        {categoryData.map((d, i) => (
          <Text style={styles.text} key={i}>
            {d.name || 'Unknown'}: {d.count}
          </Text>
        ))}

        <Text style={styles.sectionTitle}>😊 Sentiment</Text>
        <Text style={styles.sentiment}>{sentiment}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    flex: 1,
    paddingTop: 20,
    paddingStart: 5,
    paddingEnd: 5,
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  text: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 6,
  },
  sentiment: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  heatmap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    maxWidth: 294, // 14 columns * (20 block + 1 gap)
  },
  block: {
    width: 20,
    height: 20,
    margin: 1,
    borderRadius: 3,
  },
});
