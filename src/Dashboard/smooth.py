


import json
import pandas as pd
import matplotlib.pyplot as plt


jsonData=input()


# In[10]:


df=pd.read_json(jsonData)
# df


# In[11]:


df['Date']=df['TimeStamp'].apply(lambda x: x.date())




window_size = 20

# Apply a simple moving average (SMA) to smooth the 'Values' column
df['Smoothed_Values'] = df['Value'].ewm(span=window_size).mean()
df.dropna(inplace=True)
print(df)
