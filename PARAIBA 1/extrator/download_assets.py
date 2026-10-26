import urllib.request
import os

os.makedirs('static/css', exist_ok=True)
os.makedirs('static/js', exist_ok=True)

urllib.request.urlretrieve('https://fineasyaiproject.pages.dev/static/css/style.css', 'static/css/style.css')
urllib.request.urlretrieve('https://fineasyaiproject.pages.dev/static/js/main.js', 'static/js/main.js')
urllib.request.urlretrieve('https://fineasyaiproject.pages.dev/static/js/theme.js', 'static/js/theme.js')

print("Downloaded static assets successfully.")
