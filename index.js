const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const fetch = require("cross-fetch");
const express = require("express");
const schedule = require("node-schedule");
const dotenv = require("dotenv").config({ debug: true });
const app = express();
const port = 3000;
const firebaseConfig = {
	type: dotenv.parsed.type,
	project_id: dotenv.parsed.project_id,
	private_key_id: dotenv.parsed.private_key_id,
	private_key: dotenv.parsed.private_key,
	client_email: dotenv.parsed.client_email,
	client_id: dotenv.parsed.client_id,
	auth_uri: dotenv.parsed.auth_uri,
	token_uri: dotenv.parsed.token_uri,
	auth_provider_x509_cert_url: dotenv.parsed.auth_provider_x509_cert_url,
	client_x509_cert_url: dotenv.parsed.client_x509_cert_url,
};
app.listen(port, async () => {
	initializeApp({
		credential: cert(firebaseConfig),
	});
	// [{area1:Number, area2:Number, area3:Number,timeGathered: firebase.Timestamp, parameter: String}]
	const pastData = await getPastData("past_daily_records", "Temperature");
	// [[Number],[Number],[Number]]
	const twoDimensionalArrayinput = processPastDataToSendToML(pastData);
	// [Number]
	const areaPredictions = await sendToML(
		twoDimensionalArrayinput,
		"Temperature",
	);

	schedule.scheduleJob("59 * * * *", async () => {});
});

const getPastData = async (ref, parameter) => {
	// ref = String
	// parameter = String
	try {
		const db = getFirestore();
		const snapshot = await db
			.collection(ref)
			.where("parameter", "==", parameter)
			.orderBy("timeGathered", "desc")
			.get();
		const arr = [];
		snapshot.forEach((doc) => {
			arr.push(doc.data());
		});
		return arr;
	} catch (e) {
		console.error(e);
	}
};
const processPastDataToSendToML = (arr) => {
	// arr = {area1: Number, area2: Number, area3: Number, timeGathered: firebase.Timestamp, parameter: String}
	const area1 = [];
	const area2 = [];
	const area3 = [];
	for (const data of arr) {
		area1.push(data.area1);
		area2.push(data.area2);
		area3.push(data.area3);
	}
	return [area1, area2, area3];
};
const sendToML = async (twoDArr, parameter) => {
	let url = "";
	if (parameter === "Temperature") url = dotenv.parsed.temperature_url;
	if (parameter === "pH") url = dotenv.parsed.ph_url;
	if (parameter === "Salinity") url = dotenv.parsed.salinity_url;
	if (parameter === "Ammonium") url = dotenv.parsed.ammonium_url;
	if (parameter === "Nitrate") url = dotenv.parsed.nitrate_url;
	if (parameter === "Chloride") url = dotenv.parsed.chloride_url;
	const preds = [];
	for (const input of twoDArr) {
		try {
			const response = await fetch(dotenv.parsed.temperature_url, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(input),
			});
			const data = await response.json();
			preds.push(data.prediction);
		} catch (e) {
			console.warn(e);
		}
	}
	return preds;
};
const postPredictionData = async (ref, parameter, arr) => {
	const currentDate = new Date();
	const data = {
		area1: arr[0],
		area2: arr[1],
		area3: arr[2],
		timeGathered: currentDate.getDate() + 1,
		parameter: parameter,
	};
	try {
		const db = getFirestore();
		const snapshot = await db.collection(ref).add(data);
	} catch (e) {
		console.error(e);
	}
};
// get past data > send to ml model > recieve prediction > post to db predictions > remove past predictions
