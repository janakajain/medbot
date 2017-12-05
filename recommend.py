import pickle
import pandas as pd
from pymetamap import MetaMap

def get_umls_concepts(sentence, metamap):
    concepts, error = metamap.extract_concepts([sentence])
    lookup_names = [concept[3] for concept in concepts]
    triggers = [concept[6] for concept in concepts]
    
    return lookup_names, triggers


def recommend(data, medications, symptom_lookup_names, triggers):
    results = []
    for medication in medications:
        med_data = data[data['Medication'] == medication]
        i = 0
        for lookups in med_data['Lookup_Name']:
            for lookup in lookups.split(','):
                    j = 0
                    for symptom in symptom_lookup_names:
                        if symptom == lookup:
                            results.append((lookup, med_data.iloc[i]['Action'], triggers[j]))
                        j+=1
            i+=1
            
    emergencies = [result for result in results if result[1] == 'emergency']
    doctor = [result for result in results if result[1] == 'doctor']
    noneed = [result for result in results if result[1] == 'noneed']
    
    if len(emergencies) > 0:
        return 'Emergency', emergencies
    elif len(doctor) > 0:
        return 'Call your doctor', doctor
    elif len(noneed) > 0:
        return "Don't worry", noneed
    else:
        return 'No Matches Found', None

data = pd.read_pickle(open('updated_data.pickle', 'rb'))  
mm = MetaMap.get_instance('/Users/jgalsurkar/Package_Downloads/public_mm/bin/metamap16')
lookup_names, triggers = get_umls_concepts('I have some head pain and a rash on my face.', mm)
print('RESULTS')
print(recommend(data, ['betaxolol'],lookup_names, triggers ))