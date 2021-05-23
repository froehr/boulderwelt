from datetime import date

from flask import Flask
from flask.json import JSONEncoder
from flask_cors import CORS

from api import api as api_blueprint

app = Flask(__name__, static_url_path='')

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# blueprint for api parts of app
app.register_blueprint(api_blueprint)


# jsonify set time format to iso
class CustomJSONEncoder(JSONEncoder):
    def default(self, obj):
        try:
            if isinstance(obj, date):
                return obj.isoformat()
            iterable = iter(obj)
        except TypeError:
            pass
        else:
            return list(iterable)
        return JSONEncoder.default(self, obj)


app.json_encoder = CustomJSONEncoder

if __name__ == '__main__':
    app.run()
