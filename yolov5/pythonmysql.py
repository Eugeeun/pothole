import pymysql
import os
import requests
from dotenv import load_dotenv
import json

load_dotenv(verbose=True)

LOCATION_API_KEY = os.getenv('LOCATION_API_KEY')

url = f'https://www.googleapis.com/geolocation/v1/geolocate?key={LOCATION_API_KEY}'
data = {
    'considerIp': True,
}

connection = pymysql.connect(
    host='localhost',
    user='root',
    password='1801116',
    database='pothole'
)

def save_pothole(id, img_path, date):
    location = json.loads(requests.post(url, data).text)
    latitude, longitude = location['location']['lat'], location['location']['lng']
    cursor = connection.cursor()
    sql = f'insert ignore into pothole_infomation values ({id},\'{img_path}\' , \'{latitude}\', \'{longitude}\',\'{date}\', \'admin\');'
    print(sql)
    cursor.execute(sql)
    connection.commit()
    return cursor.rowcount
    