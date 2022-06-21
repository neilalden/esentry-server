import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import pickle

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

Temp_lr_tsf = pickle.load(open('/home/neilalden/mysite/Temp_lr_tsf.pkl', 'rb'))
pH_lr_tsf = pickle.load(open('/home/neilalden/mysite/pH_lr_tsf.pkl', 'rb'))
Sal_lr_tsf = pickle.load(open('/home/neilalden/mysite/Sal_lr_tsf.pkl', 'rb'))
Amm_lr_tsf = pickle.load(open('/home/neilalden/mysite/Amm_lr_tsf.pkl', 'rb'))
Nit_lr_tsf = pickle.load(open('/home/neilalden/mysite/Nit_lr_tsf.pkl', 'rb'))
Chl_lr_tsf = pickle.load(open('/home/neilalden/mysite/Chl_lr_tsf.pkl', 'rb'))

@app.route('/predict/forecast/temperature',methods=['POST'])
@cross_origin()
def temperature_forecast_api():
    data = request.get_json(force=True)
    Temp_lr_tsf_pred = Temp_lr_tsf.predict([data])
    Temp_lr_tsf_pred = Temp_lr_tsf_pred.tolist()
    return jsonify(prediction=Temp_lr_tsf_pred[0])

@app.route('/predict/forecast/ph',methods=['POST'])
@cross_origin()
def ph_forecast_api():
    data = request.get_json(force=True)
    pH_lr_tsf_pred = pH_lr_tsf.predict([data])
    pH_lr_tsf_pred = pH_lr_tsf_pred.tolist()
    return jsonify(prediction=pH_lr_tsf_pred[0])

@app.route('/predict/forecast/salinity',methods=['POST'])
@cross_origin()
def sal_forecast_api():
    data = request.get_json(force=True)
    Sal_lr_tsf_pred = Sal_lr_tsf.predict([data])
    Sal_lr_tsf_pred = Sal_lr_tsf_pred.tolist()
    return jsonify(prediction=Sal_lr_tsf_pred[0])

@app.route('/predict/forecast/ammonium',methods=['POST'])
@cross_origin()
def amm_forecast_api():
    data = request.get_json(force=True)
    Amm_lr_tsf_pred = Amm_lr_tsf.predict([data])
    Amm_lr_tsf_pred = Amm_lr_tsf_pred.tolist()
    return jsonify(prediction=Amm_lr_tsf_pred[0])

@app.route('/predict/forecast/nitrate',methods=['POST'])
@cross_origin()
def nit_forecast_api():
    data = request.get_json(force=True)
    Nit_lr_tsf_pred = Nit_lr_tsf.predict([data])
    Nit_lr_tsf_pred = Nit_lr_tsf_pred.tolist()
    return jsonify(prediction=Nit_lr_tsf_pred[0])

@app.route('/predict/forecast/chloride',methods=['POST'])
@cross_origin()
def chl_forecast_api():
    data = request.get_json(force=True)
    Chl_lr_tsf_pred = Chl_lr_tsf.predict([data])
    Chl_lr_tsf_pred = Chl_lr_tsf_pred.tolist()
    return jsonify(prediction=Chl_lr_tsf_pred[0])

if __name__ == "__main__":
    app.run(debug=True)