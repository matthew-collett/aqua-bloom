import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
from scipy.special import expit
import sys
import json


def calculateProbability(file_path):
    try:
        df = pd.read_csv(file_path)
    except FileNotFoundError:
        print(f"Error: File '{file_path}' not found.")
        sys.exit(1)
    except Exception as e:
        print(f"Error: An unexpected error occurred - {e}")
        sys.exit(1)

    df['Average'] = 0
    df['Exists'] = 0
    df['Probability'] = 0


    for index, row in df.iterrows():
        # Convert all values to numeric, coerce errors to NaN
        row_vals = pd.to_numeric(df.iloc[index, 2:8], errors='coerce').dropna()

        if not row_vals.empty:
            average = row_vals.mean()
            df.at[index, 'Average'] = average

            threshold = pd.to_numeric(df.iloc[index, 1], errors='coerce')
            if pd.notnull(threshold):
                probability = expit(10 * (average - threshold))
                df.at[index, 'Probability'] = probability
                df.at[index, 'Exists'] = int(probability > 0.5)
            else:
                # Handle the case where threshold is not a number
                # e.g., log an error, set a default value, etc.
                pass


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
    df.to_csv('output_file.csv', index=False)


    final_dict = df.to_dict(orient='records')

    json_string = json.dumps(final_dict)

    json_object = json.loads(json_string)

    with open('final_json.json', 'w') as f:
        json.dump(json_object, f)

    return json_string

# json_obj = convert_json(newdf)
