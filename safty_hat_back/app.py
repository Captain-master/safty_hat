from exts import app
from flask_cors import CORS
from Blue.login import sign_in
from Blue.index import index
from Blue.reward import reward
from Blue.pro_user import pro

app.register_blueprint(sign_in, url_prefix='/sign_in')
app.register_blueprint(index, url_prefix='/index')
app.register_blueprint(reward, url_prefix='/award')
app.register_blueprint(pro, url_prefix='/pro_workers')

CORS(app, supports_credentials=True)


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)
