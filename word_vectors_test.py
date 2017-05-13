import pandas as pd
import numpy as np
import gensim
from gensim.models import Word2Vec
from collections import Counter,defaultdict
import re
import operator
import time
import numpy as np
from sklearn.cluster import KMeans
from sklearn.manifold import TSNE
import matplotlib.pyplot as plt
start=time.time()

model=gensim.models.Word2Vec.load('word_vectors_50.wv')
print('time elapsed: ',time.time() - start)
print model.most_similar(positive=['night','winter'],negative=['day'],topn=2)
print model.similarity('woman','man')

df = pd.read_csv('./formatted_ufo_reports.csv',names=['Date_obs', 'Day', 'Month',
       'Year', 'Time', 'Date_Posted', 'Day_Posted', 'Month_Posted',
       'Year_Posted', 'City', 'State', 'Country', 'Shape', 'Time_mins',
       'Time_text', 'Experiences', 'Lattitude', 'Longitude']);

sent_rep=np.zeros((len(df),200),dtype=float);

def sumup(sentence):
    sentence=sentence.lower()
    sentence=re.sub('[^A-Za-z0-9]',' ' ,sentence)
    sentrep=np.zeros((1,200),dtype=float);
    for word in sentence.split():
        try:
           sentrep+=model[word]
        except:
           pass 
    return sentrep

for idx,sent in enumerate(df.Experiences):
    sent_rep[idx]=sumup(sent);

inertia=[];
for k in range(1,5):
    kmeans=KMeans(n_clusters=k)
    kmeans.fit(sent_rep)
    inertia.append(kmeans.inertia_);
    print("k= ",k)
    print("inertia= ",kmeans.inertia_) 
figure
plt.plot(range(1,5),inertia)
plt.show()
#print(sent_rep[1:5,1:5])
k=5
kmeans=KMeans(n_clusters=k)
kmeans.fit(sent_rep)

labels=kmeans.labels_
centroids=kmeans.cluster_centers_

tsne=TSNE(n_components=2)
#pick 50 points from each cluster
sent_rep_picked=[];#np.zeros((k*200,50),dtype=float)

for i in range(k):
    sent_label=sent_rep[np.where(label==i)]
    if(sent_label.shape[0]>20):
      #pick 200 random points
      random_pts=np.random.randint(0,sent_label.shape[0],20)
      for pt in random_pts:
          sent_rep_picked.append(sent_label[pt]);
    else:
      for pt in range(sent_label.shape[0]):
          sent_rep_picked.append(sent_label[pt]);          
     
sent_rep_2D=tsne.fit_transform(sent_rep_picked)
centroids_2D=tsne.fit_transform(centroids)



for i in range(k):
    ds=sent_rep_2D[np.where(labels==i)]
    plt.plot(ds[0],ds[1],'o')
    lines=plt.plot(centroids_2D[i,0],centroids_2D[i,1],'X')
    plt.setp(lines,ms=15.0)
    plt.setp(lines,mew=2.0)
plt.show()    
  

point_x=[ds[0] for ds in sent_rep_2D]
point_y=[ds[1] for ds in sent_rep_2D]





