
import pandas as pd
import numpy as np
import gensim
from gensim.models import Word2Vec


df = pd.read_csv('./ufo-scrubbed-geocoded-time-standardized.csv',names=['Date','City','State','Country',
                      'Shape','Time_mins','Time_text','Experiences','Date_Posted','Lattitude','Longitude']);
df.index=df.index.astype(int);
print(df.index.is_integer())
#print(df.head(2));
#print(pd.isnull(df))
#print(df.index)

names=['Date','City','State','Country',
                      'Shape','Time_mins','Time_text','Experiences','Date_Posted','Lattitude','Longitude'];
indices=[];

#split date into date and time
for idx,i in enumerate(df['Date']):
    if(':' not  in i):
      indices.append(idx);

df=df.drop(df.index[[indices]]);         
indices=[];



date_obs=[];
date_posted=[];

day=[];
month=[];
year=[];

time=[]

def create_columns(x):
    x_=x.split();
    try:
       date_obs.append(x_[0])
       date=x_[0].split('/');
       month.append(date[0])
       day.append(date[1])
       year.append(date[2]) 
     
       time.append(x_[1])
    except:
      print(x_) 

map(create_columns,df['Date'])

df.drop('Date', axis=1, inplace=True); #delete the column Date

df.insert(0,'Date_obs',date_obs);
df.insert(1,'Day',day);
df.insert(2,'Month',month)
df.insert(3,'Year',year)
df.insert(4,'Time',time)


day=[];
month=[];
year=[];
date_posted=[];
def create_columns_posted(x_):
    try:
       date_posted.append(x_)
       date=x_.split('/');
       month.append(date[0])
       day.append(date[1])
       year.append(date[2]) 
    except:
      print(x_) 

map(create_columns_posted,df['Date_Posted'])

df.drop('Date_Posted', axis=1, inplace=True); #delete the column Date

df.insert(5,'Date_Posted',date_posted);
df.insert(6,'Day_Posted',day);
df.insert(7,'Month_Posted',month)
df.insert(8,'Year_Posted',year)

df.columns=df.columns.astype(str)
#print(np.all(~pd.isnull(df),axis=0)) #something missing from every column. 
for i in df.columns:
    if(~np.all(~pd.isnull(df[i]),axis=0)):
       print("******************",i,"******************")

#change/drop state null
expr_nan_set=df.ix[pd.isnull(df['Experiences'])];
print("Experiences nan number: ",len(expr_nan_set));
indices=expr_nan_set.index;
df=df.drop(df.index[[indices]]);         
df.reset_index(level=int,inplace=True);

shape_nan_set=df.ix[pd.isnull(df['Shape'])];
print("Shapes nan number: ",len(shape_nan_set));
indices=shape_nan_set.index;
df=df.drop(df.index[[indices]]);         
df.reset_index(level=int,inplace=True);

print("After removing expr and shape: ",len(df))
print(df.head(2))
#state examples
state_nan_set=df.ix[pd.isnull(df['State'])==True];
cities= state_nan_set['City']

for city in np.unique(cities.values):
    states= np.unique(df[df['City'] == city]['State'].values)  
    states= filter(lambda v: v==v, states) #find the states that are not NaN
    if(states!=[]):
       state_nan_set.ix[(state_nan_set['City'] == city),'State']=states[0];

df.ix[state_nan_set.index,:]=state_nan_set;
state_nan_set=df.ix[pd.isnull(df['State'])];
#remove those indices that are not resolved yet.
indices=state_nan_set.index;
df=df.drop(df.index[[indices]]);         
try:
   df.reset_index(level=int,inplace=True);
except:
   pass
country_nan_set=df.loc[pd.isnull(df['Country'])];
states= country_nan_set['State']

for state in np.unique(states.values):
    countries= np.unique(df[df['State'] == state]['Country'].values)  
    countries= filter(lambda v: v==v,countries)
    if(countries!=[]):
      country_nan_set.ix[(country_nan_set['State'] == state),'Country']=countries[0];

df.ix[country_nan_set.index,:]=country_nan_set;
try:
   df.reset_index(level=int,inplace=True);
except:
   pass

country_nan_set=df.loc[pd.isnull(df['Country'])];

#remove those indices that are not resolved yet.
indices=country_nan_set.index;
df=df.drop(df.index[[indices]]);         
try:
   df.reset_index(level=int,inplace=True);
except:
   pass

for i in df.columns:
    if(~np.all(~pd.isnull(df[i]),axis=0)):
       print("******************",i,"******************")

shape_nan_set=df.ix[pd.isnull(df['Shape'])];
print(len(df))
df.to_csv('./formatted_ufo_reports.csv');
