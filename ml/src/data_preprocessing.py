import pandas as pd
import numpy as np

def load_data(path):
    return pd.read_csv(path)


def convert_size_to_bhk(size):
    try:
        return int(size.split(' ')[0])
    except:
        return None


def clean_data(df):

    # Remove rows with missing essential values
    df = df.dropna(subset=['location', 'size', 'total_sqft', 'price'])

    # Convert size "2 BHK" → 2
    df['bhk'] = df['size'].apply(convert_size_to_bhk)

    # Convert total_sqft
    def convert_sqft(x):
        try:
            if '-' in str(x):
                a, b = x.split('-')
                return (float(a) + float(b)) / 2
            return float(x)
        except:
            return None

    df['total_sqft'] = df['total_sqft'].apply(convert_sqft)

    # Drop rows with invalid sqft
    df = df.dropna(subset=['total_sqft'])

    # Create price-per-sqft
    df['price_per_sqft'] = df['price'] * 100000 / df['total_sqft']

    # Clean locations
    df['location'] = df['location'].apply(lambda x: x.strip())
    loc_stats = df['location'].value_counts()
    rare_locs = loc_stats[loc_stats <= 10].index
    df['location'] = df['location'].apply(lambda x: 'other' if x in rare_locs else x)

    # 🔥 Final cleanup: drop ALL remaining NaNs (bath, bhk, etc.)
    df = df.dropna()

    return df
