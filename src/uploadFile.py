import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
from scipy.special import expit
import sys
import json

def read_file():
    if len(sys.argv) != 2:
        print("Usage: python script.py <file_path>")
        sys.exit(1)

    file_path = sys.argv[1]

    try:
        df = pd.read_csv(file_path)
        return df
    except FileNotFoundError:
        print(f"Error: File '{file_path}' not found.")
        sys.exit(1)
    except Exception as e:
        print(f"Error: An unexpected error occurred - {e}")
        sys.exit(1)


def calculateProbability():

    df = read_file()

    df['Average'] = 0 
    df['Exists'] = 0 
    df['Probability'] = 0

    for index, row in df.iterrows():

        row_vals = df.iloc[index, 2:8].dropna()

        average = row_vals.mean()
        df.at[index, 'Average'] = average

        threshold = df.iloc[index, 1]

        probability = expit(10 * (average - threshold))
        df.at[index, 'Probability'] = probability

        if(probability > 0.5):
            df.at[index, 'Exists'] = 1

    # print("Threshhold: " + str(threshold) + " Avg: " + str(average) + " Prob: " + str(probability))

    # print(df)

    new_columns = {
        'Id': 'ID',
        'target': 'Target',
        '1': 'Test1',
        '2': 'Test2',
        '3': 'Test3',
        '4': 'Test4',
        '5': 'Test5',
        '6': 'Test6',
        '7': 'Test7',
        'Probability': 'Probability'
    }

    df.rename(columns=new_columns, inplace=True)
    df.fillna('Inconclusive', inplace=True)
    # print(df)

    final_dict = df.to_dict(orient='records')

    json_string = json.dumps(final_dict)

    json_object = json.loads(json_string)


    with open('final_json.json', 'w') as f:
        json.dump(json_object, f)

    # print(json_string)
    return(json_object)

newdf = calculateProbability()

# json_obj = convert_json(newdf)