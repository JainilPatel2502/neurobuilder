import numpy as np
def clean_dataframe(df):
    return df.replace({np.nan: None, 'N/A': None})
