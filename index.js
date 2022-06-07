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
app.listen(port, () => {
	initializeApp({
		credential: cert(firebaseConfig),
	});
	schedule.scheduleJob("*/1 * * * *", async () => {
		const input = {
			z: 35,
			x: 31,
			y: 1,
			u: 0,
			i: 8,
			w: 2,
		};
		try {
			const response = await fetch(
				"http://neilalden.pythonanywhere.com/predict/crime",
				{
					// mode: "no-cors",
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(input),
				},
			);
			const data = await response.json();
			console.log(data);
		} catch (e) {
			console.warn(e);
		}
	});

	const db = getFirestore();
	// db.collection("records")
	// 	.doc("13UWXhmZAwlvyA0MTxX2")
	// 	.get()
	// 	.then((res) => {
	// 		console.log(res.data());
	// 	})
	// 	.catch((e) => {
	// 		console.warn(e);
	// 	});
});
