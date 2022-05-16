import requests

def getData():
    try: 
        d = requests.get('https://google.com/')
        if(d.status_code == 200):
            return 'True'.encode('ascii', errors='ignore').decode('UTF-8')
        else: 
            return 'False'.encode('ascii', errors='ignore').decode('UTF-8')
    except: 
        return  'False'

print(getData())

    