import pandas
import json

df = pandas.read_json('haveibeenpwned.json')

print df.head(1)

df.to_csv('haveibeenpwned.csv', encoding='utf-8')
